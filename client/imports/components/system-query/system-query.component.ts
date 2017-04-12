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


  permissionStatus = [
    {value: 'enabled', label: 'Enabled'},
    {value: 'disabled', label: 'Disabled'},
    {value: 'null', label: 'Not Configured'}
  ];

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
  args: any[] = [];
  messages: any; // messages for data table
  handles: Subscription[] = []; // all subscription handles
  handle: Subscription; // all subscription handles
  systemLookup: any = {};
  dataTableOptions: any = {};
  returnData: string[];
  selected: any[] = [];
  oldSelected: any[] = [];
  objLocal: any = {};
  methods: any[] = [];
  lookupDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  keywordsDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  pageDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  onePageDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  searchDep: Dependency = new Dependency(); // keywords dependency to invoke a search function

  constructor(public dialog: MdDialog) {}

  ngOnInit() {
    this.handles.forEach(handle => {
      handle.unsubscribe();
    })

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
    this.objLocal['sort'] = {
      'prop': 'username',
      'value': 1
    }

    MeteorObservable.autorun().subscribe(() => {
      this.objLocal.parentTenantId = Session.get('parentTenantId');
      this.objLocal.tenantId = Session.get('tenantId');
      MeteorObservable.subscribe('one_systemLookups', this.lookupName, Session.get('tenantId')).subscribe();

        this.systemLookup = SystemLookups.collection.findOne({
          name: this.lookupName,
          tenantId: Session.get('tenantId')
        });

        MeteorObservable.autorun().subscribe(() => {
          this.keywordsDep.depend();
          this.lookupDep.depend();
          this.pageDep.depend();

          if (this.systemLookup) {
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
  }

  setRows(systemLookup) {

    let subscriptions = systemLookup.subscriptions;

    let arr = [];
    let methods = systemLookup.methods;

    methods.map(method => {
      let name = method.name;
      let methodArgs = [];

      if (method.name === 'aggregate' || method.name === 'find') {
        methodArgs = parseAll(method.args, this.objLocal);

        if (method.name === 'aggregate') {

          subscriptions.forEach(subscription => {
            let args = subscription.args;
            args = parseAll(args, this.objLocal);

            MeteorObservable.subscribe(subscription.name, ...args).subscribe();
            let result = objCollections[subscription.name].collection.find(...args).fetch();
          })
          MeteorObservable.call('aggregate', method.collectionName, ...methodArgs)
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

          this.args = methodArgs;
          this.args[1].skip = 0;


          MeteorObservable.autorun().subscribe(() => {
            this.onePageDep.depend();
            this.searchDep.depend();


            this.handle = MeteorObservable.subscribe(method.collectionName, ...this.args, this.keywords).subscribe();

            let result = objCollections[method.collectionName].collection.find({}).fetch();
            console.log('caonim', result);

            let hand = MeteorObservable.autorun().subscribe(() => {


              if (method.return.returnable === true ) {
                this.isReturn = true;
                if ('data' in method.return) {
                  this.returnData = method.return.data;
                }
              }

              this.rows = [];
              this.selected = [];
              result.forEach((doc, index) => {
                if (doc.enabled === true) {
                  this.selected.push(doc);
                }

                this.rows[this.skip + index]= doc;

              });

              // this.count = this.rows.length;

              this.count = Counts.get(this.lookupName);
              console.log('counttttt ', this.lookupName,  this.count);

              this.oldSelected = this.selected.slice();
            })

            // this.handles.push(hand);
          })
        }
        return method;
      }
    })
    this.methods = methods;
    console.log(methods);
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

  onSelect(event) {

    if (this.isReturn) {
      let result = '';
      let selected = event.selected[0];

      if (this.returnData) {

        this.returnData.forEach(field => {
          if (field in selected) {
            result += selected[field];
          } else {
            result += field;
          }
        })
      } else {
        result = selected;
      }
      this.onSelected.emit(result);
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

    this.objLocal['selected'] = objSelectedItem;

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
    this.offset = 0;
    this.skip = 0;
    this.args[1].skip = 0;
    this.searchDep.changed();
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
    // this.systemLookup.query.findOptions.skip = this.skip;
    this.args[1].skip = this.skip;
    this.onePageDep.changed();
  }

  onChange(event, selected) {
    selected.status = event.value;

    // console.log(event);
    console.log(selected);
    this.objLocal['selected'] = selected;
    let subscriptions = this.systemLookup.subscriptions;
    this.methods.forEach(method => {
      let name = method.name;
      let methodArgs = [];

      if (method.name === 'update') {
        methodArgs = parseAll(method.args, this.objLocal);
        console.log('methods', methodArgs);
        console.log('methods', methodArgs);
        console.log('methods', methodArgs);

        MeteorObservable.call('update', method.collectionName, ...methodArgs)
          .subscribe((res:any[]) => {

            // this.rows = [];
            // this.selected = [];
            // res.forEach((doc, index) => {
            //   if (doc.enabled === true) {
            //     this.selected.push(doc);
            //   }
            //
            //   this.rows[this.skip + index]= doc;
            //
            // });
            //
            // this.count = this.rows.length;
            //
            // this.oldSelected = this.selected.slice();
          });
      }
    })
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
    let temp = {prop: sortProp, value: 1};

    if (event.sorts[0].dir == 'asc') {
      temp.value = 1;
      // sort.$sort[sortProp] = 1;
    } else {
      temp.value = -1;
      // sort.$sort[sortProp] = -1;
    }

    this.args[1].sort = {
      [temp.prop]: temp.value
    }
    this.args[1].skip = 0;

    this.objLocal['sort'] = temp;
    this.onePageDep.changed();
  }

  save() {

    this.onReturn.emit({});
  }

  ngOnDestroy() {
    if (this.handle) {
      this.handle.unsubscribe();
    }
    this.handles.forEach(handle => {
      handle.unsubscribe();
    })
  }
}

function parseAll(args, objLocal) {
  return args.map((arg) => {
    arg = parseDollar(arg);
    arg = parseDot(arg);
    arg = parseParams(arg, objLocal);
    return arg.value;
  });
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
