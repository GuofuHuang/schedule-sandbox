import {Component, Input, Output, EventEmitter} from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {MeteorObservable} from 'meteor-rxjs';

import { SystemLookups } from '../../../../both/collections';
import template from './system-lookup.component.html';

@Component({
  selector: 'system-lookup',
  template
})

export class SystemLookupComponent {
  @Input() Collections: any[];
  @Input() lookupName: string;
  @Output() onSelected = new EventEmitter<string>();

  rows: Object[]; // row data to be displayed in the data table
  columns: any[]; // headers in the data table
  systemLookup: any; // data retrieved from system lookup collection, contains all data
  displayedFields: any; // fields data will be displayed in the data table
  returnedFields: any; // fields data will be returned as string result to the customer
  collectionName: string; // collection name for the lookup
  allData: Object[]; // data retrieved from collection including hidden field in the data table
  searchKeywords: string; // used to search keywords
  selector: any;
  keywordsDep: Tracker.Dependency;
  keywords: string;

  count: number = 100;
  offset: number = 5;
  limit: number = 10;

  constructor(public dialogRef: MdDialogRef<SystemLookupComponent>) {}

  ngOnInit() {

    this.keywordsDep = new Tracker.Dependency();

    this.selector = {};
    if (this.Collections.length == 1) {

      this.collectionName = this.Collections[0]._collection._name;

      MeteorObservable.subscribe('systemLookups', this.lookupName).subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {

          SystemLookups.find({name: this.lookupName}).cursor
            .map(result => {
              this.systemLookup = result;
            });

          this.getTableData(this.selector, this.systemLookup);
        });
      })
    }
  }

  getTableData(selector, systemLookup) {

    MeteorObservable.autorun().subscribe(() => {
      this.keywordsDep.depend();


      let fields = systemLookup.findOptions.fields;

      if (!this.keywords) {
        this.selector = selector;
      } else {
        this.selector = this.generateRegex(fields, this.keywords);
      }

      this.makeSubcription();

      this.getColumns();

      this.getRows();

    })
  }

  getColumns() {
    let displayedFields = {
      fields: {},
      limit: Number,
      sort: {}
    };

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
        displayedFields.fields[column.fieldName] = 1;
      }
      if (column.returned) {
        this.returnedFields[index] = column.fieldName;
      }
    });

    this.columns = arr;

    this.displayedFields = displayedFields;
  }

  getRows() {
    this.displayedFields.limit = this.systemLookup.findOptions.limit;
    this.displayedFields.sort = this.systemLookup.findOptions.sort;
    this.displayedFields = this.displayedFields;

    this.rows = [];

    this.Collections[0].find(this.selector, this.displayedFields)
      .subscribe((result) => {
        this.rows = result;
      })

    // empty the fields option to get all fields
    this.displayedFields.fields = {};
    this.Collections[0].find({}, this.displayedFields)
      .subscribe(result => {
        this.allData = result;
      });
  }

  makeSubcription() {
    Meteor.subscribe(this.collectionName, this.selector, this.systemLookup.findOptions, this.keywords);
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
    let index = event.selected[0].$$index;
    let selected = this.allData[index];
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
    let temp = event.sorts[0].prop;
    this.systemLookup.findOptions.sort = {};
    if (event.sorts[0].dir == 'asc') {
      this.systemLookup.findOptions.sort[temp] = 1;
    } else {
      this.systemLookup.findOptions.sort[temp] = -1;
    }

    this.getTableData(this.selector, this.systemLookup);
  }

  search(keywords) {
    this.keywords = keywords;
    this.keywordsDep.changed();
  }
}