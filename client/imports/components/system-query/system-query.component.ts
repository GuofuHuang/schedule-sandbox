import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog } from '@angular/material';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';


import { objCollections } from '../../../../both/collections';
import { SystemLookups } from '../../../../both/collections/systemLookups.collection';
import { DialogComponent } from '../dialog/dialog.component';
import template from './system-query.component.html';

import Dependency = Tracker.Dependency;

@Component({
  selector: 'system-query',
  template
})

export class SystemQueryComponent implements OnInit, OnDestroy {
  @Input() collection: any;
  @Input() lookupName: string;
  @Input() updateDocumentId: any;
  @Input() data: any;
  @Output() onSelected = new EventEmitter<string>();
  @Output() onReturn = new EventEmitter<{}>();
  @Output() return = new EventEmitter<{}>();
  @ViewChild('statusDropboxTmpl') statusDropboxTmpl: TemplateRef<any>;
  @ViewChild('lookupTmpl') lookupTmpl: TemplateRef<any>;

  rows: any[] = []; // row data to be displayed in the data table
  columns: any[] = []; // headers in the data table
  selector: any = {}; // selector for the mognodb collection search
  keywords: string = ''; // keywords to search the database
  isReturn: boolean = false;

  start: number = 0; // start index for the rows displayed in the data table
  count: number = 10; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 10; // limit for the data table
  skip: number = 0;
  messages: any; // messages for data table
  handles: Subscription[]; // all subscription handles
  systemLookup: any = {};
  dataTableOptions: any = {};
  returnData: string[];
  selected: any[] = [];
  oldSelected: any[] = [];
  objLocal: any = {};
  lookupDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  keywordsDep: Dependency = new Dependency(); // keywords dependency to invoke a search function

  constructor(public dialog: MdDialog) {}

  ngOnInit() {
    this.messages = {
      emptyMessage: 'no data available in table',
      totalMessage: 'total'
    };
    this.handles = [];
    if (this.updateDocumentId === undefined) {
      console.log('undefined')
    } else {
      console.log('exists');
      this.objLocal['updateDocumentId'] = this.updateDocumentId;
    }

    this.objLocal['data'] = this.data;
    this.objLocal['sort'] = {name: 1};

    MeteorObservable.autorun().subscribe(() => {
      this.objLocal.parentTenantId = Session.get('parentTenantId');

      MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe();

        this.systemLookup = SystemLookups.collection.findOne({
          name: this.lookupName,
          tenantId: Session.get('tenantId')
        });

        MeteorObservable.autorun().subscribe(() => {
          this.keywordsDep.depend();
          this.lookupDep.depend();

          if (this.systemLookup) {
            let subscriptions = this.systemLookup.subscriptions;

            subscriptions.forEach(subscription => {
              let args = subscription.args;
              args = args.map((arg) => {
                arg = parseDollar(arg);
                arg = parseDot(arg);
                arg = parseParams(arg, this.objLocal);

                return arg.value;
              });

              MeteorObservable.subscribe(subscription.name, ...args).subscribe();
              let pp = objCollections[subscription.name].collection.find().fetch();
              console.log('pp', pp);
              let result = objCollections[subscription.name].collection.find(...args).fetch();
              console.log('result', result);
            })

            this.columns = this.getColumns(this.systemLookup);
            this.columns.forEach(column => {
              if ('cellTemplate' in column) {
                column.cellTemplate = this[column.cellTemplate];
              }
            })
            this.dataTableOptions = this.systemLookup.dataTable.table;

            this.setRows(this.systemLookup);


          }

        })
    })


    // this.collection = this.Collections[0];

    // let handle = MeteorObservable.autorun().subscribe(() => {
    //
    //   this.handles.push(MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe());
    //
    //   // console.log(this.systemLookup);
    //   this.systemLookup = SystemLookups.collection.findOne({
    //     name: this.lookupName,
    //     tenantId: Session.get('tenantId')
    //   });
    //
    //   let handle = MeteorObservable.autorun().subscribe(() => {
    //
    //     // put dependency here
    //
    //     this.keywordsDep.depend();
    //     this.lookupDep.depend();
    //
    //     // this.dataTableOptions = this.systemLookup.dataTableOptions;
    //
    //     if (this.systemLookup) {
    //       this.columns = this.getColumnsM(this.systemLookup);
    //       this.dataTableOptions = this.systemLookup.dataTable.table;
    //
    //       this.selected = [];
    //
    //       if (this.Collections.length > 1) {
    //
    //         this.systemLookup.query.pipeline = parseDollar(this.systemLookup.query.pipeline);
    //
    //         this.getRowsM(this.systemLookup, this.columns, this.keywords);
    //       } else {
    //         if (this.systemLookup.query.selector) {
    //           let temp = this.systemLookup.query.selector;
    //           this.systemLookup.query.selector = parseDot(temp);
    //           this.systemLookup.query.selector = parseDollar(this.systemLookup.query.selector);
    //         }
    //
    //         this.limit = this.systemLookup.query.findOptions.limit;
    //         // set rows inside this function
    //         this.getRows(this.systemLookup, this.columns, this.keywords);
    //         this.selected = [];
    //
    //       }
    //     }
    //   })
    //   this.handles.push(handle);
    // });
    // this.handles.push(handle);

  }

  setRows(systemLookup) {
      let arr = [];
      let methods = this.systemLookup.methods;
      methods.forEach(method => {
      let name = method.name;
      let value = method.value;

      if (method.name === 'aggregate') {


        let args = method.args;

        args = args.map((arg) => {
          arg = parseDollar(arg);
          arg = parseDot(arg);
          arg = parseParams(arg, this.objLocal);

          return arg.value;
        });

        MeteorObservable.call('aggregate', method.collectionName, ...args)
          .subscribe((res:any[]) => {

          this.rows = [];
          this.selected = [];
          res.forEach((doc, index) => {
            if (doc.enabled === true) {
              this.selected.push(doc);
            }

            this.rows[this.skip + index]= doc;

          });

          this.count = this.rows.length;

          this.oldSelected = this.selected.slice();

        });
      } else if (method.name == 'find') {

        let args = method.args;
        if (method.return.returnable === true ) {
          this.isReturn = true;
        }

        args = args.map((arg) => {
          arg = parseDollar(arg);
          arg = parseDot(arg);
          arg = parseParams(arg, this.objLocal);

          return arg.value;
        });


        let result = objCollections[method.collectionName].collection.find(...args).fetch();

        this.rows = [];
        this.selected = [];
        result.forEach((doc, index) => {
          if (doc.enabled === true) {
            this.selected.push(doc);
          }

          this.rows[this.skip + index]= doc;

        });

        this.count = this.rows.length;

        this.oldSelected = this.selected.slice();
      }
    })
  }

  getColumns(systemLookup:any) {
    let arr = [];
    // select displayed columns to data table

    systemLookup.dataTable.columns.forEach((column, index) => {
      let obj = {};
      if (!column.hidden) {
        Object.keys(column).forEach(key => {
          obj[key] = column[key];
        });
        arr.push(obj);
      }
    });

    return arr;
  }

  onSelect(selected) {

    if (this.isReturn) {
      this.onReturn.emit(selected.selected[0]);
      return;
    }
      let temp = [];
    this.selected.forEach(item => {
      temp.push(item._id);
    });

    let objSelectedItem;

    let methods = this.systemLookup.methods;
    let isAdding = true;

    if (this.selected.length > this.oldSelected.length) {
      isAdding = true;
      // enabled
      objSelectedItem = this.selected[this.selected.length - 1];

      this.objLocal['enabled'] = true;

    } else {
      // disabled
      isAdding = false
      this.oldSelected.some(item => {
        let index = temp.findIndex((tempItem, yy) => {
          return (tempItem == item._id);
        });

        if (index < 0) {
          objSelectedItem = item;
          return true;
        }
      });

      this.objLocal['enabled'] = false;
    }

    this.objLocal['selectedId'] = objSelectedItem._id;
    this.objLocal['selected'] = objSelectedItem;
    console.log(this.objLocal['selected.tenantId']);
    console.log(this.objLocal['selected']);


    methods.forEach(method => {
      if (method.name === 'update') {
        if ((isAdding === true && method.type == 'add') || (isAdding === false && method.type == 'remove') || (method.type == 'update')) {
          let args = method.args.map((arg) => {
            arg = parseDollar(arg);
            arg = parseDot(arg);
            arg = parseParams(arg, this.objLocal);

            return arg.value;
          });

          console.log(args);
          MeteorObservable.call('update', method.collectionName, ...args).subscribe(res => {
            this.oldSelected = this.selected.slice();
          });

          let result = objCollections['users'].collection.find().fetch();
          console.log(result);
        }


      }
    });



  }




  // get rows for single system lookup

  getSelector(systemLookup) {
    let fields = systemLookup.query.findOptions.fields;
    let selector = {};
    if ('tenantId' in fields) {
      selector = { tenantId: Session.get('tenantId')};

    } else if ('tenants' in fields) {
      selector = { "tenants._id": Session.get('tenantId')};
    }
    return selector;
  }

  search(keywords) {
    this.keywords = keywords;
    this.lookupDep.changed();
  }








  add() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  onPage(event) {
    this.offset = event.offset;
    this.skip = event.offset * event.limit;
    this.systemLookup.query.findOptions.skip = this.skip;
    this.keywordsDep.changed();
  }

  onClick(row) {

    let dialogRef = this.dialog.open(DialogComponent, {
      height: "600px",
      width: "800px"
    });

    console.log(row);
    console.log(this.updateDocumentId);
    let selectedRow = {
      _id: row._id
    }

    dialogRef.componentInstance.lookupName = 'updateUserGroups1';
    dialogRef.componentInstance.updateDocumentId = this.updateDocumentId;
    dialogRef.componentInstance.data = selectedRow;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result != 'undefined') {
        console.log(result);
      }
    });

  }

  onSort(event) {
    console.log(event);
    let sortProp = event.sorts[0].prop;
    this.offset = 0;
    this.skip = 0;

    let sort = {$sort: {}};

    if (event.sorts[0].dir == 'asc') {
      sort.$sort[sortProp] = 1;
    } else {
      sort.$sort[sortProp] = -1;
    }

    console.log(sort);

    // this.systemLookup.query.pipeline.push(sort);
    // else {
    //   this.systemLookup.query.findOptions.skip = 0;
    //   this.systemLookup.query.findOptions.sort = {};
    //   if (event.sorts[0].dir == 'asc') {
    //     this.systemLookup.query.findOptions.sort[sortProp] = 1;
    //   } else {
    //     this.systemLookup.query.findOptions.sort[sortProp] = -1;
    //   }
    // }


    // this.lookupDep.changed();
  }

  save() {

    this.onReturn.emit({});
  }

  ngOnDestroy() {
    this.handles.forEach(handle => {
      handle.unsubscribe();
    })
  }
}

function parseDollar(obj:any) {
  obj = JSON.stringify(obj);
  obj = obj.replace(/_\$/g, '$');
  obj = JSON.parse(obj);
  return obj;
}

function parseDot(obj:any) {
  obj = JSON.stringify(obj);
  obj = obj.replace(/_DOT_/g, '.');
  obj = JSON.parse(obj);
  return obj;

}

function parseParams(obj:any, objLocal:any={}) {

  let copiedObj = Object.assign({}, obj);
  obj = JSON.stringify(obj);

  if ('params' in copiedObj) {
    copiedObj.params.forEach((param, index) => {

      if(param.indexOf('.') !== -1) {
        let arrParam = param.split('.');
        let copiedObjLocal = Object.assign({}, objLocal);
        let ooo = copiedObjLocal;
        arrParam.forEach((param, i) => {

          ooo = ooo[param];
          console.log('ooo', ooo);
          if (i == arrParam.length-1) {
            obj = obj.replace(new RegExp('_VAR_' + index, 'g'), ooo);
          }
        })
        // would be true. Period found in file name

      } else {
        console.log(typeof [param] == 'string');
        if (['boolean', 'number'].indexOf(typeof objLocal[param]) >= 0) {
          // if it is a boolean or number
          obj = obj.replace(new RegExp('"_VAR_' + index + '"', 'g'), objLocal[param]);
        } else {
          obj = obj.replace(new RegExp('_VAR_' + index, 'g'), objLocal[param]);
        }
      }

    });
  }
  obj = JSON.parse(obj);


  // obj.$sort = objLocal.sort;

  console.log('obj', obj);

  return obj;
}

function generateRegex(fields: Object, keywords) {
  let obj = {
    $or: []
  };
  Object.keys(fields).forEach((key, index) => {
    obj.$or.push({
      [key]: {$regex: new RegExp(keywords, 'i')}
    })
  });
  return obj;
}
