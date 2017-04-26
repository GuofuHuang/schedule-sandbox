import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog } from '@angular/material';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Session } from 'meteor/session';

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
  @Input() lookupName: string;
  @Input() updateDocumentId: any;
  @Input() data: any;
  @Output() onSelected = new EventEmitter<string>();
  @ViewChild('statusDropboxTmpl') statusDropboxTmpl: TemplateRef<any>;  // used to update status of group permissions, (unconfigured, enabled, disabled)
  @ViewChild('lookupTmpl') lookupTmpl: TemplateRef<any>; // used to pop out the window to change the tenants groups
  @ViewChild('removeTmpl') removeTmpl: TemplateRef<any>; // used to remove the user

  permissionStatus = [
    {value: 'enabled', label: 'Enabled'},
    {value: 'disabled', label: 'Disabled'},
    {value: 'null', label: 'Not Configured'}
  ];

  // datatable section
  rows: any[] = []; // data to be displayed in the data table
  temp: any; // cloned rows data to be displayed in the data table
  columns: any[] = []; // headers in the data table
  selector: any = {}; // selector for the mognodb collection search
  keywords: string = ''; // keywords to search the database
  returnable: boolean = false; //
  returnData: string[]; // used to defined what data to be returned when selected
  selected: any[] = []; // current selected items
  oldSelected: any[] = []; // old selected items for the datatable
  dataTableOptions: any = {}; // options for the datatable
  messages: any; // messages for data table
  count: number = 0; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 10; // limit for the data table
  skip: number = 0; // skip for the data table

  methodArgs: any[] = []; // current method args
  method: any = {}; // current method
  handles: Subscription[] = []; // all subscription handles
  subscriptions: Subscription[] = []; // all subscription handles
  handle: Subscription; // all subscription handles
  findHandle: Subscription; // all subscription handles
  systemLookup: any = {}; // current system lookup object
  objLocal: any = {}; // used to store variables data to be substitute for the params
  methods: any[] = []; // all methods
  isClick: boolean = false; // detect if the event is click event
  findDep: Dependency = new Dependency(); // keywords dependency to invoke a search function

  constructor(public dialog: MdDialog) {}

  ngOnInit() {
    this.subscriptions.forEach(handle => {
      handle.unsubscribe();
    })

    this.messages = {
      emptyMessage: 'no data available in table',
      totalMessage: 'total'
    };
    this.subscriptions = [];
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

    this.subscriptions[0] = MeteorObservable.autorun().subscribe(() => {
      this.objLocal.parentTenantId = Session.get('parentTenantId');
      this.objLocal.tenantId = Session.get('tenantId');
      // let handle = MeteorObservable.subscribe('one_systemLookups', this.lookupName, Session.get('parentTenantId')).subscribe();

      let query = {
        name: this.lookupName,
        parentTenantId: Session.get('parentTenantId')
      };

      if (this.lookupName !== 'systemLookups') {
        this.subscriptions[1] = MeteorObservable.subscribe('systemLookups', query, {}, '').subscribe(() => {
          this.subscriptions[2] = MeteorObservable.autorun().subscribe(() => {

            this.systemLookup = SystemLookups.collection.findOne(query);
            if (this.systemLookup) {
              this.columns = this.getColumns(this.systemLookup);
              this.columns.forEach(column => {
                if ('cellTemplate' in column) {
                  column.cellTemplate = this[column.cellTemplate];
                }
              });

              this.dataTableOptions = this.systemLookup.dataTable.table;
              this.setRows(this.systemLookup);
            }
          });
        })

      } else {
        this.subscriptions[1] = MeteorObservable.call('findOne', 'systemLookups', query, {}).subscribe((res:any) => {
          this.systemLookup = res;
          this.subscriptions[2] = MeteorObservable.autorun().subscribe(() => {
            if (this.systemLookup) {
              this.columns = this.getColumns(this.systemLookup);
              this.columns.forEach(column => {
                if ('cellTemplate' in column) {
                  column.cellTemplate = this[column.cellTemplate];
                }
              });

              this.dataTableOptions = this.systemLookup.dataTable.table;
              this.setRows(this.systemLookup);
            }
          });
        });
      }

    });
  }

  setRows(systemLookup) {

    let subscriptions = systemLookup.subscriptions;
    subscriptions.forEach(subscription => {
      let args = subscription.args;
      args = parseAll(args, this.objLocal);

      this.subscriptions[3] = MeteorObservable.subscribe(subscription.name, ...args).subscribe();
      objCollections[subscription.name].collection.find(...args).fetch();
    })

    let methods = systemLookup.methods;
    this.methods = methods;
    this.retrieveData(methods);
  }

  retrieveData(methods:any = []) {
    methods.forEach(method => {
      if (method) {
        if (('isHeader' in method) && method.isHeader === false ) {
        } else {
          this.runAggregateOrFindMethod(method);
        }
      }
    })
  }

  runUpdateMethod(methods:any, updateType) {
    methods.forEach(method => {
      if (method.name === 'update') {
        if (updateType.value === method.type) {
          let args = method.args.map((arg) => {
            arg = parseDollar(arg);
            arg = parseDot(arg);
            arg = parseParams(arg, this.objLocal);

            return arg.value;
          });

          MeteorObservable.call('update', method.collectionName, ...args).subscribe(res => {
            this.oldSelected = this.selected.slice();
          });

          let result = objCollections['users'].collection.find().fetch();
        }
      }
    });
  }

  runAggregateOrFindMethod(method:any) {

    let methodArgs = [];

    if (method && (method.name === 'aggregate' || method.name === 'find')) {
      methodArgs = parseAll(method.args, this.objLocal);
      this.method = method;
      if (method.name === 'aggregate') {

        this.dataTableOptions.externalSorting = false;
        this.subscriptions[4] = MeteorObservable.call('aggregate', method.collectionName, ...methodArgs)
          .subscribe((res:any[]) => {
            this.getRowsFromMethod(res, method);
          });

      } else if (method.name == 'find') {
        this.dataTableOptions.externalSorting = true;

        this.methodArgs = methodArgs;

        this.subscriptions[4] = MeteorObservable.autorun().subscribe(() => {

          this.findDep.depend();

          if (this.subscriptions[5]) {
            this.subscriptions[5].unsubscribe();
          }
          if (this.subscriptions[6]) {
            this.subscriptions[6].unsubscribe();
          }

          this.subscriptions[5] = MeteorObservable.subscribe(method.collectionName, ...this.methodArgs, this.keywords)
            .subscribe(() => {
              this.subscriptions[6] = MeteorObservable.autorun().subscribe(() => {
                let result = [];

                result = objCollections[method.collectionName].collection.find({}).fetch();

                if (result.length > 0) {
                  this.getRowsFromMethod(result, method);
                }
              })
            });
        })
      }
    }
  }

  getRowsFromMethod(res, method) {
    if ('return' in method) {
      if ('returnable' in method.return) {
        if (method.return.returnable === true ) {
          this.returnable = true;
          if ('data' in method.return) {
            this.returnData = method.return.data;
          }
        }
      }

      if ('next' in method.return && method.return.next === true) {
        if (method.return.dataType == "object") {
          let result = objCollections[method.collectionName].collection.find(this.methodArgs[0], this.methodArgs[1]).fetch();
          this.objLocal[method.return.as] = result[0];
          this.runAggregateOrFindMethod(this.methods[method.return.nextMethodIndex]);
        }
        return;
      }
    }

    this.rows = [];
    this.selected = [];
    res.forEach((doc, index) => {
      if (doc.enabled === true) {
        this.selected.push(doc);
      }
      this.rows[this.skip + index]= doc;
    });

    if (method.name === 'find') {
      this.count = Counts.get(this.lookupName);
    } else {
      this.count = this.rows.length;
    }
    this.oldSelected = this.selected.slice();
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
    if (this.isClick) {
      this.isClick = false;
      return;
    } else {
      if (this.returnable) {
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

      let selectedIds = [];
      this.selected.forEach(item => {
        selectedIds.push(item._id);
      });

      let methods = this.systemLookup.methods;
      let updateType = {
        value: 'update'
      }

      this.objLocal['selected'] = this.getSelectedItem(updateType, selectedIds);
      this.runUpdateMethod(methods, updateType);
    }
  }

  getSelectedItem(updateType, selectedIds) {
    let objSelectedItem;
    if (this.selected.length > this.oldSelected.length) {
      updateType.value = 'add';
      // enabled
      objSelectedItem = this.selected[this.selected.length - 1];

      this.objLocal['enabled'] = true;

    } else if (this.selected.length < this.oldSelected.length) {
      // disabled
      updateType.value = 'remove';
      this.oldSelected.some(item => {
        let index = selectedIds.findIndex((tempItem, yy) => {
          return (tempItem == item._id);
        });

        if (index < 0) {
          objSelectedItem = item;
          return true;
        }
      });

      this.objLocal['enabled'] = false;
    } else {
      updateType.value = 'update';
    }
    return objSelectedItem;
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
    if (this.method.name === 'aggregate') {
      // filter our data
      const temp = this.temp.filter(function(d) {
        let result = false;
        Object.keys(d).some(key => {
          let str = JSON.stringify(d[key]);
          if (str.toLowerCase().indexOf(keywords) !== -1) {
            result = true;
            return true;
          }
        });
        return result || !keywords;
      });

      // update the rows
      this.rows = temp;
      this.count = this.rows.length;
      // // Whenever the filter changes, always go back to the first page
      this.offset = 0;

    } else if (this.method.name === 'find') {
      this.keywords = keywords;
      this.offset = 0;
      this.skip = 0;
      this.methodArgs[1].skip = 0;
      this.findDep.changed();
    }
  }

  updateFilter(event) {
    const val = event.target.value;

    // filter data
    const temp = this.rows.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.offset = 0;
  }

  onPage(event) {
    if (this.method.name === 'aggregate') {

    } else if (this.method.name === 'find') {
      this.offset = event.offset;
      this.skip = event.offset * event.limit;
      // this.systemLookup.query.findOptions.skip = this.skip;
      this.methodArgs[1].skip = this.skip;
      this.findDep.changed();
    }
  }

  onChange(event, selected) {
    selected.status = event.value;

    this.objLocal['selected'] = selected;
    let subscriptions = this.systemLookup.subscriptions;
    this.methods.forEach(method => {
      let name = method.name;
      let methodArgs = [];

      if (method.name === 'update') {
        methodArgs = parseAll(method.args, this.objLocal);
        MeteorObservable.call('update', method.collectionName, ...methodArgs)
          .subscribe();
      }
    })
  }

  onClick(row, clickType) {
    this.objLocal['selected'] = row;
    this.isClick = true;
    if (clickType === 'update') {
      this.runUpdateMethod(this.methods, {value: clickType});
    } else {
      let dialogRef = this.dialog.open(DialogComponent, {
        height: "600px",
        width: "800px"
      });

      let selectedRow = {
        _id: row._id
      }

      dialogRef.componentInstance.lookupName = 'updateUserGroups';
      dialogRef.componentInstance.updateDocumentId = this.updateDocumentId;
      dialogRef.componentInstance.data = selectedRow;
      dialogRef.afterClosed().subscribe(result => {
        if (typeof result != 'undefined') {
          console.log(result);
        }
      });
    }
  }

  onSort(event) {
    if (this.method.name === 'aggregate') {

    } else if (this.method.name === 'find') {

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

      this.methodArgs[1].sort = {
        [temp.prop]: temp.value
      }
      this.methodArgs[1].skip = 0;

      this.objLocal['sort'] = temp;
      this.findDep.changed();
    }
  }

  ngOnDestroy() {
    this.methods = [];
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
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
        arrParam.forEach((param, i) => {
          copiedObjLocal = copiedObjLocal[param];
          if (i == arrParam.length-1) {
            if (typeof copiedObjLocal != 'string') {
              copiedObjLocal = JSON.stringify(copiedObjLocal);
              obj = obj.replace(new RegExp('"_VAR_' + index + '"', 'g'), copiedObjLocal);
            } else {
              obj = obj.replace(new RegExp('_VAR_' + index, 'g'), copiedObjLocal);
            }
          }
        })
      } else {
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
