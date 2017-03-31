<<<<<<< HEAD
=======

>>>>>>> master
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';
import Dependency = Tracker.Dependency;

import template from './field-update-lookup.component.html';
import { SystemLookups } from '../../../../both/collections';

@Component({
  selector: 'field-update-lookup',
  template
})

export class FieldUpdateLookupComponent implements OnInit, OnDestroy{
  @Input() updateCollection: any;
  @Input() fromCollection: any;
  @Input() lookupName: string;
  @Input() updatedDocumentId: any;
  @ViewChild('statusDropboxTmpl') statusDropboxTmpl: TemplateRef<any>;

  foods = [
    {value: 'enabled', viewValue: 'Enabled'},
    {value: 'disabled', viewValue: 'Disabled'},
    {value: 'null', viewValue: 'Not Configured'}
  ];
  caonima: string = 'enabled';
  permissionStatus = [
    {value: 'enabled', label: 'Enabled'},
    {value: 'disabled', label: 'Disabled'},
    {value: 'null', label: 'Not Configured'}
  ];

  rows: any[] = []; // row data to be displayed in the data table
  columns: any[] = []; // headers in the data table
  selector: any = {}; // selector for the mognodb collection search
  keywords: string = ''; // keywords to search the database
  updateField: string[] = [];
<<<<<<< HEAD
=======
  arrField: string[] = [];
>>>>>>> master

  count: number = 10; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 0; // limit for the data table
  skip: number = 0;
  messages: any; // messages for data table
  handles: Subscription[] = []; // all subscription handles
  handle: Subscription; // all subscription handles
  systemLookup: any = {};
  dataTable: any = {};
  returnedFields: string[];
  selected: any[] = [];
  oldSelected: any[] = [];
  strUpdateField: string;
  sortDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  keywordsDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  pageDep: Dependency = new Dependency(); // page dependency to invoke a pagination function
  searchDep: Dependency = new Dependency(); // page dependency to invoke a pagination function
<<<<<<< HEAD
=======

>>>>>>> master
  someVal: {} = {
    test: '1',
    cao: '2',
    name: '1'
  };
<<<<<<< HEAD
=======

>>>>>>> master
  constructor() {}

  ngOnInit() {


<<<<<<< HEAD


=======
>>>>>>> master
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
          this.systemLookup.single.findOptions.skip = this.skip;
          this.strUpdateField = this.systemLookup.single.updateField;
<<<<<<< HEAD
          this.columns = this.getColumns(this.systemLookup);
          this.columns.forEach(column => {
            if ('cellTemplate' in column) {
              column.cellTemplate = this.statusDropboxTmpl;
            }
          })

          this.dataTable = this.systemLookup.dataTable.table;

=======

          this.columns = this.getColumns(this.systemLookup);
          this.columns[2].cellTemplate = this.statusDropboxTmpl;


            this.dataTable = this.systemLookup.dataTable.table;

          // this.columns = this.getColumnsM(this.systemLookup);
          this.dataTable = this.systemLookup.dataTable.table;



>>>>>>> master
          this.selected = [];
          this.limit = this.systemLookup.single.findOptions.limit;
          // set rows inside this function

          this.getRows(this.systemLookup, this.columns, this.keywords);
        }
      })
    });
  }

  getSelector(systemLookup) {
    let fields = systemLookup.single.findOptions.fields;
    let selector = {};
    if ('tenantId' in fields) {
      selector = { tenantId: Session.get('tenantId')};

    } else if ('tenants' in fields) {
      selector = { tenants: {$in: [Session.get('tenantId')]}};
    }
    return selector;
  }

<<<<<<< HEAD
=======

>>>>>>> master
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

<<<<<<< HEAD
=======

    console.log('1');

>>>>>>> master
    this.systemLookup.single.findOptions.skip = this.skip;
    let selector = this.getSelector(this.systemLookup);
    let options = this.systemLookup.single.findOptions;

    MeteorObservable.subscribe(this.lookupName, selector, options, keywords).subscribe();

    this.handle = MeteorObservable.autorun().subscribe(() => {
<<<<<<< HEAD
=======
      console.log('2');
>>>>>>> master

      this.pageDep.depend();
      let doc = this.updateCollection.findOne(this.updatedDocumentId);
      if (this.strUpdateField in doc) {
<<<<<<< HEAD
=======

>>>>>>> master
        this.updateField = doc[this.strUpdateField];
      } else {
        // this.updateField = undefined;
      }

<<<<<<< HEAD
=======

>>>>>>> master
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

      this.fromCollection.collection.find(select, options).forEach((item, index) => {

<<<<<<< HEAD
        if (Array.isArray(this.updateField)) {
          this.updateField.forEach(id => {
=======
        console.log('3');

        if (Array.isArray(this.updateField)) {
          this.updateField.forEach(id => {

>>>>>>> master
            if (item._id == id) {
              this.selected.push(item);
            }
          })

<<<<<<< HEAD

=======
>>>>>>> master
          this.oldSelected = this.selected.slice();


          this.rows[this.skip + index]= item;
        } else if (typeof this.updateField == 'object') {

<<<<<<< HEAD
          // this.oldSelected = this.selected.slice();

          this.rows[this.skip + index]= item;
=======
          console.log('4');

          // this.oldSelected = this.selected.slice();

          this.rows[this.skip + index]= item;
          console.log('5');
>>>>>>> master
        }

      });

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
<<<<<<< HEAD
=======

>>>>>>> master
    let temp = [];

    this.selected.forEach(item => {
      temp.push(item._id);
    });



    let update;
    if (this.selected.length > this.oldSelected.length) {
      // add
      let objNewSelected = this.selected[this.selected.length - 1];
      update = {
        $addToSet: {
          [this.strUpdateField]: objNewSelected._id
        }
      }


    } else {
      // remove
      let removedItem;
      this.oldSelected.some(item => {
        let index = temp.findIndex((tempItem) => {
          return (tempItem == item._id);
        });

        if (index < 0) {
          removedItem = item;
          return true;
        }
      })

      update = {
        $pull: {
          [this.strUpdateField]: {
            $in: [removedItem._id]
          }
        }
      }
    }

    MeteorObservable.call('updateField', this.updateCollection._collection._name, this.updatedDocumentId, update).subscribe();

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

    this.systemLookup.single.findOptions.skip = 0;
    this.systemLookup.single.findOptions.sort = {};
    if (event.sorts[0].dir == 'asc') {
      this.systemLookup.single.findOptions.sort[sortProp] = 1;
    } else {
      this.systemLookup.single.findOptions.sort[sortProp] = -1;
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
