import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';
import Dependency = Tracker.Dependency;

import template from './field-update-lookup.component.html';
import { SystemLookups } from '../../../../both/collections/systemLookups.collection';

@Component({
  selector: 'field-update-lookup',
  template
})

export class FieldUpdateLookupComponent implements OnInit, OnDestroy{
  @Input() updateCollection: any;
  @Input() fromCollection: any;
  @Input() lookupName: string;
  @Input() updatedDocumentId: any;
  @ViewChild('lookupTmpl') statusDropboxTmpl: TemplateRef<any>;
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
  updateField: any;

  count: number = 10; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 0; // limit for the data table
  skip: number = 0;
  messages: any; // messages for data table
  handles: Subscription[] = []; // all subscription handles
  handle: Subscription; // all subscription handles
  systemLookup: any = {};
  dataTable: any = {};
  selected: any[] = [];
  oldSelected: any[] = [];
  strUpdateField: string;
  sortDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  keywordsDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  pageDep: Dependency = new Dependency(); // page dependency to invoke a pagination function
  searchDep: Dependency = new Dependency(); // page dependency to invoke a pagination function

  constructor() {}

  ngOnInit() {

    this.messages = {
      emptyMessage: 'no data available in table',
      totalMessage: 'total'
    };

    MeteorObservable.subscribe('one_'+this.updateCollection._collection._name, this.updatedDocumentId).subscribe();
    let handle = MeteorObservable.autorun().subscribe(() => {

      this.handles.push(MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe());

      this.systemLookup = SystemLookups.collection.findOne({
        name: this.lookupName,
        tenantId: Session.get('tenantId')
      });


      let handle = MeteorObservable.autorun().subscribe(() => {

        this.sortDep.depend();
        this.searchDep.depend();

        if (this.systemLookup) {
          this.systemLookup.query.findOptions.skip = this.skip;
          this.strUpdateField = this.systemLookup.query.updateField;
          this.columns = this.getColumns(this.systemLookup);
          this.columns.forEach(column => {
            if ('cellTemplate' in column) {
              column.cellTemplate = this.statusDropboxTmpl;
            }
          })

          this.dataTable = this.systemLookup.dataTable.table;

          this.selected = [];
          if (this.systemLookup.query.selector) {
            let temp = this.systemLookup.query.selector;
            this.systemLookup.query.selector = parseDot(temp);
            this.systemLookup.query.selector = parseDollar(this.systemLookup.query.selector);
          }

          this.limit = this.systemLookup.query.findOptions.limit;
          // set rows inside this function

          this.getRows(this.systemLookup, this.columns, this.keywords);
        }
      })
    });
  }

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

  getRows(systemLookup, columns, keywords) {

    let arr = [];

    this.systemLookup.query.findOptions.skip = this.skip;
    let selector;
    if (systemLookup.query.selector) {
      selector = systemLookup.query.selector;

      if (systemLookup.query.paramName) {
        let temp = systemLookup.query.paramName;
        selector = replaceParams(selector, temp);
      }
    } else {
      selector = this.getSelector(systemLookup);
    }
    let options = this.systemLookup.query.findOptions;

    MeteorObservable.subscribe(this.lookupName, selector, options, keywords).subscribe();

    this.handle = MeteorObservable.autorun().subscribe(() => {

      this.pageDep.depend();
      let doc = this.updateCollection.findOne(this.updatedDocumentId);
      if (this.strUpdateField in doc) {
        this.updateField = doc[this.strUpdateField];
      } else {
        // this.updateField = undefined;
      }

      let fields = options.fields;
      let select;

      if (!keywords || keywords == '') {
        select = selector;
      } else {
        select = generateRegex(fields, keywords);
      }

      this.rows = [];
      options.skip = 0;
      this.selected = [];

      let query = systemLookup.query;
      this.fromCollection.collection.find(select, options).forEach((item, index) => {
        if (query.updateFieldDataType[0] == "array") {
          if (query.updateFieldDataType[1] == "object") {
            this.updateField.forEach((record:any) => {
              if (typeof record == 'object') {
                if (item._id == record._id && record.enabled) {
                  this.selected.push(item);
                }
              }
            })
          }
          else if (query.updateFieldDataType[0] == "string") {
            this.updateField.forEach((record:any) => {
              if (item._id == record) {
                this.selected.push(item);
              }
            })
          }
        }
        else if (typeof this.updateField == 'object') {
          Object.keys(this.updateField).forEach(key => {
            if (key == item._id) {
              this.selected.push(item);
            }
            console.log(key);
          })
        }
        this.oldSelected = this.selected.slice();
        this.rows[this.skip + index]= item;
      });
      console.log(this.rows);

      this.count = Counts.get(this.lookupName);
    })

    this.handles.push(this.handle);
  }

  onChange(select, row) {

    let update = {
      $set: {
        [this.strUpdateField + '.' + row.name]: select.value
      }
    };

    MeteorObservable.call('updateField', this.updateCollection._collection._name, this.updatedDocumentId, update).subscribe();

    this.handle.unsubscribe();
  }

  onSelect(select) {
    let temp = [];

    this.selected.forEach(item => {
      temp.push(item._id);
    });
    let selector:any = {
      _id: this.updatedDocumentId
    }
    let update;
    let query = this.systemLookup.query;
    let objSelectedItem;
    if (this.selected.length > this.oldSelected.length) {
      // add
      objSelectedItem = this.selected[this.selected.length - 1];

      if (query.updateFieldDataType[0] == 'array') {
        if (query.updateFieldDataType[1] == 'object') {
          let prop = [this.strUpdateField] + '._id';
          let length = this.updateCollection.collection.find(
            {
              _id: this.updatedDocumentId,
              [prop]: {
                $in: [objSelectedItem._id]
              }
            }).count();
          if (length === 0) {
            update = {
                $addToSet: {
                  [this.strUpdateField]: {
                    enabled: true,
                    _id: objSelectedItem._id,
                    groups: []
                  }
                }
              }
          } else {
            selector[this.strUpdateField+"._id"] = objSelectedItem._id;
            prop = this.strUpdateField + ".$.enabled";
            update = {
              $set: {
                [prop]: true
              }
            };

          }

        } else if (query.updateFieldDataType[1] == 'string') {
          update = {
            $addToSet: {
              [this.strUpdateField]: objSelectedItem._id
            }

          }

        }
      }
      else if (query.updateFieldDataType[0] == 'object') {

            let prop = this.strUpdateField + '.' + objSelectedItem._id;
        update = {
          $set: {
            [prop]: []
          }
        };
        update = {
          $addToSet: {
            [this.strUpdateField]: {
            }
          }
        }
      }
    } else {
      // remove
      this.oldSelected.some(item => {
        let index = temp.findIndex((tempItem, yy) => {
          console.log(yy);
          return (tempItem == item._id);
        });

        if (index < 0) {
          objSelectedItem = item;
          return true;
        }
      })

      if (query.updateFieldDataType[0] == 'array') {
        if (query.updateFieldDataType[1] == 'object') {

          let prop = [this.strUpdateField] + '._id';

          selector[this.strUpdateField+"._id"] = objSelectedItem._id;
          console.log(selector);
          prop = this.strUpdateField + ".$.enabled";
          update = {
            $set: {
              [prop]: false
            }
          };
        } else if (query.updateFieldDataType[1] == 'string') {
          update = {
            $pull: {
              [this.strUpdateField]: {
                $in: [objSelectedItem._id]
              }
            }
          }

        }
      } else {
        update = {
          $pull: {
            [this.strUpdateField]: {
              $in: [objSelectedItem._id]
            }
          }
        }
      }


    }

    MeteorObservable.call('updateField', this.updateCollection._collection._name, selector, update).subscribe();


    console.log(this.selected);
    this.oldSelected = this.selected.slice();
  }

  search(keywords) {
    this.keywords = keywords;
    this.searchDep.changed();

  }

  onSort(event) {
    let sortProp = event.sorts[0].prop;
    this.offset = 0;
    this.skip = 0;

    this.systemLookup.query.findOptions.skip = 0;
    this.systemLookup.query.findOptions.sort = {};
    if (event.sorts[0].dir == 'asc') {
      this.systemLookup.query.findOptions.sort[sortProp] = 1;
    } else {
      this.systemLookup.query.findOptions.sort[sortProp] = -1;
    }


    this.sortDep.changed();
  }

  onPage(event) {
    this.offset = event.offset;
    this.skip = event.offset * event.limit;
    // unsubscribe all subscriptions to release old data.
    if (this.handles.length > 0 ) {
      this.handles.forEach(handle => {
        handle.unsubscribe();
      })
    }
    this.pageDep.changed();
  }

  ngOnDestroy() {
    this.handles.forEach(handle => {
      handle.unsubscribe();
    })
  }
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

function parseDot(obj:any) {
  obj = JSON.stringify(obj);
  obj = obj.replace(/_DOT_/g, '.');
  obj = JSON.parse(obj);
  return obj;

}

function parseDollar(obj:any) {
  obj = JSON.stringify(obj);
  obj = obj.replace(/_\$/g, '$');
  obj = JSON.parse(obj);
  return obj;
}

function replaceParams(obj, data?) {
  obj = JSON.stringify(obj);
  let i = 0;
  let paramIndex = 0;
  let key;
  console.log(this.systemLookup);
  while(paramIndex >= 0) {
    key = "_VAR_" + i;
    obj = obj.replace(new RegExp(key, 'g'), Session.get(data[i])); // Using Session could cause an error in the future
    i++;
    paramIndex = obj.indexOf("_VAR_");
  }

  obj = JSON.parse(obj);
  return obj;
}

function findIndexInArray(arr: any[], objectKey) {

  let index = arr.findIndex((obj) => {
    let result = Object.keys(obj).some((key) => {
      if (key == objectKey) {
        return true
      }
    });
    if (result) {
      return true;
    }
  })
  return index;
}
