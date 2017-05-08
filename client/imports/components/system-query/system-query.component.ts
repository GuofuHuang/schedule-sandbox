import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Session } from 'meteor/session';
import { NotificationsService } from 'angular2-notifications';

import { objCollections } from '../../../../both/collections';
import { SystemLookups } from '../../../../both/collections/systemLookups.collection';
import { DialogComponent } from '../dialog/dialog.component';
import template from './system-query.component.html';
import style from './system-query.component.scss';

import template1 from './template1.html';
import Dependency = Tracker.Dependency;

@Component({
  selector: 'system-query',
  template,
  styles: [ style ]
})

export class SystemQueryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() lookupName: string;
  @Input() updateDocumentId: any;
  @Input() data: any;
  @Output() onSelected = new EventEmitter<string>();
  @ViewChild('statusDropboxTmpl') statusDropboxTmpl: TemplateRef<any>;  // used to update status of group permissions, (unconfigured, enabled, disabled)
  @ViewChild('lookupTmpl') lookupTmpl: TemplateRef<any>; // used to pop out the window to change the tenants groups
  @ViewChild('removeTmpl') removeTmpl: TemplateRef<any>; // used to remove the user
  @ViewChild('actionsTmpl') actionsTmpl: TemplateRef<any>; // used to remove the user

  permissionStatus = [
    {value: 'enabled', label: 'Enabled'},
    {value: 'disabled', label: 'Disabled'},
    {value: '', label: 'Not Configured'}
  ];

  // datatable section
  rows: any[] = []; // data to be displayed in the data table
  temp: any[] = []; // cloned rows data to be displayed in the data table
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

  searchable: boolean = true;
  methodArgs: any[] = []; // current method args
  method: any = {}; // current method
  subscriptions: Subscription[] = []; // all subscription handles
  systemLookup: any = {}; // current system lookup object
  objLocal: any = {}; // used to store variables data to be substitute for the params
  methods: any[] = []; // all methods
  isClick: boolean = false; // detect if the event is click event
  findDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  auto1Dep: Dependency = new Dependency();
  hideDelete: boolean = false;

  constructor(public dialog: MdDialog, private _service: NotificationsService) {}

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

    this.objLocal['sort'] = {
      'prop': 'username',
      'value': 1
    };

    this.subscriptions[0] = MeteorObservable.autorun().subscribe(() => {
      if (this.data) {
        this.objLocal['data'] = this.data;
        if ('hidden' in this.data) {
          this.hideDelete = !this.data.hidden;
        }
      }

      this.objLocal.parentTenantId = Session.get('parentTenantId');
      this.objLocal.tenantId = Session.get('tenantId');

      let query = {
        name: this.lookupName,
        parentTenantId: Session.get('parentTenantId')
      };

      this.auto1Dep.depend();

      if (this.lookupName !== 'systemLookups') {
        this.subscriptions[1] = MeteorObservable.subscribe('systemLookups', query, {}, '').subscribe(() => {
          this.subscriptions[2] = MeteorObservable.autorun().subscribe(() => {

            this.systemLookup = SystemLookups.collection.findOne(query);
            if (this.systemLookup) {
              if ('searchable' in this.systemLookup) {
                this.searchable = this.systemLookup.searchable;
              }
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
              if ('searchable' in this.systemLookup) {
                this.searchable = this.systemLookup.searchable;
              }

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

  ngOnChanges(changes) {
    this.subscriptions.forEach((subscription, index) => {
      if (index != 0){
        subscription.unsubscribe();
      }
    })

    this.auto1Dep.changed();
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

  runMethods(methods:any, selectedMethod) {
    methods.forEach(method => {
      if (selectedMethod.type === 'update') {
        if (selectedMethod.name === method.name) {
          let args = method.args.map((arg) => {
            arg = parseDollar(arg);
            arg = parseDot(arg);
            arg = parseParams(arg, this.objLocal);

            return arg.value;
          });

          MeteorObservable.call('update', method.collectionName, ...args).subscribe(res => {
            this._service.success(
              "Message",
              'Update Successfully',
              {
                timeOut: 3500,
                showProgressBar: true,
                preventDuplicates: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 40
              }
            );
            this.oldSelected = this.selected.slice();
          });

          let result = objCollections['users'].collection.find().fetch();
        }
      } else if(method.type === 'remove') {
        let args = method.args.map((arg) => {
          arg = parseDollar(arg);
          arg = parseDot(arg);
          arg = parseParams(arg, this.objLocal);

          return arg.value;
        });

        MeteorObservable.call('remove', method.collectionName, ...args).subscribe(res => {
          this._service.success(
            "Message",
            'Remove Successfully',
            {
              timeOut: 3500,
              showProgressBar: true,
              preventDuplicates: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 40
            }
          );
          this.oldSelected = this.selected.slice();
        });

        let result = objCollections['users'].collection.find().fetch();
      }

    });
  }

  runAggregateOrFindMethod(method:any) {

    let methodArgs = [];

    if (method && (method.type === 'aggregate' || method.type === 'find')) {
      methodArgs = parseAll(method.args, this.objLocal);
      this.method = method;
      if (method.type === 'aggregate') {

        this.dataTableOptions.externalSorting = false;
        this.subscriptions[4] = MeteorObservable.call('aggregate', method.collectionName, ...methodArgs)
          .subscribe((res:any[]) => {
            this.getRowsFromMethod(res, method);
          });

      } else if (method.type == 'find') {
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

          this.subscriptions[5] = MeteorObservable.subscribe(method.subscriptionName, ...this.methodArgs, this.keywords)
            .subscribe(() => {
              this.subscriptions[6] = MeteorObservable.autorun().subscribe(() => {
                let result = [];
                let sort:any = {};

                if ('sort' in this.methodArgs[1]) {
                  sort.sort = this.methodArgs[1].sort;
                }

                result = objCollections[method.collectionName].collection.find(this.methodArgs[0], sort).fetch();

                if (result.length > 0) {
                  this.getRowsFromMethod(result, method);
                } else {
                  this.rows = [];
                  this.count = 0;
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
          // let result = objCollections[method.collectionName].collection.find(this.methodArgs[0], this.methodArgs[1]).fetch();
          this.objLocal[method.return.as] = res[0];
          this.runAggregateOrFindMethod(this.methods[method.return.nextMethodIndex]);
        }
        return;
      }
    }

    this.rows = [];
    this.selected = [];
    console.log(Meteor.users.find().fetch());
    res.forEach((doc, index) => {
      if (doc.enabled === true) {
        this.selected.push(doc);
      }
      this.rows[this.skip + index]= doc;
    });

    this.temp = this.rows.slice();
    if (method.type === 'find') {
      this.count = Counts.get(this.lookupName);
    } else {
      this.count = this.rows.length;
    }
    this.oldSelected = this.selected.slice();
  }

  getColumns(systemLookup:any) {
    let arr = [];
    // select displayed columns to data table

    let columns = systemLookup.dataTable.columns.slice();
    // let temp = parseParams(columns[0], this.objLocal);
    columns.forEach((column, index) => {
      let obj = {};
      column = parseParams(column, this.objLocal);

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
      console.log(event);
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
      let methodType = {
        name: 'add',
        type: 'update'
      }

      this.objLocal['selected'] = this.getSelectedItem(methodType, selectedIds);
      this.runMethods(methods, methodType);
    }
  }

  getSelectedItem(methodType, selectedIds) {
    let objSelectedItem;
    if (this.selected.length > this.oldSelected.length) {
      methodType.name = 'add';
      // enabled
      objSelectedItem = this.selected[this.selected.length - 1];

      this.objLocal['enabled'] = true;

    } else if (this.selected.length < this.oldSelected.length) {
      // disabled
      methodType.name = 'remove';
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
      methodType.name = 'add';
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
    if (this.method.type === 'aggregate') {
      // filter our data
      const temp = this.temp.filter((item) =>{
        let result = false;
        Object.keys(item).some(key => {
          let str = JSON.stringify(item[key]);
          if((str.indexOf(keywords) !== -1) || (str.toLowerCase().indexOf(keywords) !== -1)) {
            result = true;
            return true;
          }
        });
        return result || !keywords;
      });

      // let temp = [];
      // update the rows
      this.rows = temp;
      this.count = this.rows.length;
      // // Whenever the filter changes, always go back to the first page
      this.offset = 0;

    } else if (this.method.type === 'find') {
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
    if (this.method.type === 'aggregate') {

    } else if (this.method.type === 'find') {
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
      let name = method.type;
      let methodArgs = [];

      if (method.type === 'update') {
        methodArgs = parseAll(method.args, this.objLocal);
        MeteorObservable.call('update', method.collectionName, ...methodArgs)
          .subscribe();
      }
    })
  }

  openDialog(selectedMethod) {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.objLocal.selected.default !== true) {
          this.runMethods(this.methods, selectedMethod);
        } else {
          this._service.alert(
            'Failed',
            'You can not delete',
            {}
          )
        }
      }
    });
  }

  onClick(row, selectedMethod) {
    this.objLocal['selected'] = row;
    this.isClick = true;
    if (selectedMethod !== null) {
      if (selectedMethod.type === 'remove' || selectedMethod.name === 'disable') {
        this.openDialog(selectedMethod);
      } else {
        this.runMethods(this.methods, selectedMethod);
      }
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

  getHeight(row: any, index: number): number {
    return row.someHeight;
  }

  getRowClass(row) {
    return {
      'age-is-ten': (row.age % 10) === 0
    };

  }

  onSort(event) {
    if (this.method.type === 'aggregate') {

    } else if (this.method.type === 'find') {

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


@Component({
  selector: 'dialog-Select',
  template: template1
})

export class DialogSelect {
  constructor(public dialogRef: MdDialogRef<DialogSelect>) {}
}