import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {MeteorObservable} from 'meteor-rxjs';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { SystemLookups } from '../../../../both/collections';
import template from './system-lookup.component.html';

@Component({
  selector: 'system-lookup',
  template
})

export class SystemLookupComponent implements OnInit, OnDestroy {
  @Input() Collections: any[];
  @Input() lookupName: string;
  @Output() onSelected = new EventEmitter<string>();

  rows: any[] = []; // row data to be displayed in the data table
  columns: any[] = []; // headers in the data table
  systemLookup: any; // data retrieved from system lookup collection, contains all data
  displayedFields: any; // fields data will be displayed in the data table
  returnedFields: any; // fields data will be returned as string result to the customer
  collectionName: string; // collection name for the lookup
  allFields: Object[]; // data retrieved from collection including hidden field in the data table
  selector: any = {}; // selector for the mognodb collection search
  keywordsDep: Tracker.Dependency = new Tracker.Dependency(); // keywords dependency to invoke a search function
  keywords: string; // keywords to search the database

  start: number = 0; // start index for the rows displayed in the data table
  count: number = 0; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 0; // limit for the data table
  offsetArr: {} = {0:0}; // offset array for the data added to the data table
  messages: any; // messages for data table
  handle: any; // handle the subscription

  optionsSub: Subscription;

  constructor() {}

  ngOnInit() {

    this.selector = {tenantId: Session.get('tenantId')};

    this.messages = {
      emptyMessage: 'no data available in table',
      totalMessage: 'total'
    }

    this.displayedFields = {
      fields: {},
      limit: Number,
      sort: {}
    };

    this.systemLookup = {
      dataTableOptions: [],
      findOptions: {
        sort: {}
      }
    }

    if (this.Collections.length == 1) {

      this.collectionName = this.Collections[0]._collection._name;
      MeteorObservable.subscribe('systemLookups', this.lookupName).subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {
          //
          this.systemLookup = SystemLookups.find({name: this.lookupName}).cursor
            .fetch()[0];
          this.limit = this.systemLookup.findOptions.limit;
          this.getColumns();

          this.getTableData(this.selector, this.systemLookup);


        });
      })
    }
  }

  getTableData(selector, systemLookup) {
    this.makeSubcription();

    MeteorObservable.autorun().subscribe(() => {

      this.keywordsDep.depend();

      let fields = systemLookup.findOptions.fields;

      if (!this.keywords || this.keywords == '') {
        this.selector = selector;
      } else {
        this.selector = this.generateRegex(fields, this.keywords);
      }
      this.getRows();
    })
  }

  getColumns() {
    let arr = [];

    this.returnedFields = [];
    // select displayed columns to data table
    this.systemLookup.dataTableOptions.forEach((column, index) => {
      if (!column.hidden) {
        let obj = {
          prop: column.fieldName,
          name: column.label
        }
        arr.push(obj);
        this.displayedFields.fields[column.fieldName] = 1;
      }
      if (column.returned) {
        this.returnedFields[index] = column.fieldName;
      }

    });

    this.columns = arr;
  }

  getRows() {
    // this code is required get the data reactively

    this.displayedFields.limit = this.limit;
    if (this.systemLookup.hasOwnProperty('findOptions')) {
      if (this.systemLookup.findOptions.hasOwnProperty('sort')) {

        this.displayedFields.sort = this.systemLookup.findOptions.sort;
      }
    }

    this.rows = [];

    if (this.collectionName == 'users') {
      this.selector.tenants = {$in: [Session.get('tenantId')]};
      delete this.selector['tenantId'];
    }

    this.displayedFields.skip = 0;

    this.Collections[0].find(this.selector, this.displayedFields).cursor
      .map((doc, index) => {
        this.rows[this.start+index] = doc;
      })

    // empty the fields option to get all fields
    this.displayedFields.fields = {};
    this.allFields = this.Collections[0].find(this.selector, this.displayedFields).cursor
      .fetch();
    this.count = Counts.get(this.lookupName);
  }

  makeSubcription() {
    if (this.collectionName == 'users') {
      this.selector.tenants = {$in: [Session.get('tenantId')]};
      delete this.selector['tenantId'];
    }

    this.handle = Meteor.subscribe(this.lookupName, this.selector, this.systemLookup.findOptions, this.keywords);
  }

  generateRegex(fields: Object, keywords: string) {
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

  onSelect(event) {
    this.systemLookup = '';
    let index = event.selected[0].$$index - this.offset*this.limit;
    let selected = this.allFields[index];
    let result;

    // loop through the returnFields
    for (let i = 0; i < this.returnedFields.length; i++){
      if (i == 0) {
        result = selected[this.returnedFields[i]];
      } else {
        result = result + ' - ' + selected[this.returnedFields[i]];
      }
    }
    this.onSelected.emit(result);
  }

  onSort(event) {

    this.handle.stop();
    this.displayedFields.skip = 0;
    this.start = 0;
    this.offset = 0;
    this.systemLookup.findOptions.skip = 0;
    this.offsetArr = {0:0};
    let temp = event.sorts[0].prop;
    this.systemLookup.findOptions.sort = {};
    if (event.sorts[0].dir == 'asc') {
      this.systemLookup.findOptions.sort[temp] = 1;
    } else {
      this.systemLookup.findOptions.sort[temp] = -1;
    }

    this.getColumns();

    this.getTableData(this.selector, this.systemLookup);
  }

  onPage(event) {

    this.start = event.offset * this.limit;

    let i =0;
    Object.keys(this.offsetArr).forEach((value, index) => {

      if (value < event.offset) {
        i++;
      }
    })

    this.displayedFields.skip = i * this.limit;
    this.offsetArr[event.offset] = event.offset;

    event.limit = undefined;
    this.systemLookup.findOptions.skip = event.offset * this.systemLookup.findOptions.limit;
    this.offset = event.offset;

    this.handle.stop();
    this.makeSubcription();
    this.getRows();
  }

  search(keywords) {
    if (keywords == '') {
      keywords = null;
    }
    this.displayedFields.skip = 0;
    this.start = 0;
    this.offset = 0;
    this.systemLookup.findOptions.skip = 0;
    this.keywords = keywords;
    this.selector = {tenantId: Session.get('tenantId')};
    this.handle.stop();

    this.makeSubcription();
    this.keywordsDep.changed();
  }

  ngOnDestroy() {
    this.handle.stop();
  }
}
