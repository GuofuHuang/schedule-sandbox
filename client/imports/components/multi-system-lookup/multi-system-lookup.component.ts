import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './multi-system-lookup.component.html';
import { SystemLookups } from '../../../../both/collections';

@Component({
  selector: 'multi-system-lookup',
  template
})

export class MultiSystemLookup implements OnInit, OnDestroy {
  @Input() Collections: any[];
  @Input() collection: any;
  @Input() lookupName: string;
  @Output() onSelected = new EventEmitter<string>();

  rows: any[] = []; // row data to be displayed in the data table
  columns: any[] = []; // headers in the data table
  selector: any = {}; // selector for the mognodb collection search
  keywords: string = ''; // keywords to search the database

  start: number = 0; // start index for the rows displayed in the data table
  count: number = 10; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 0; // limit for the data table
  skip: number = 0;
  messages: any; // messages for data table
  handles: Subscription[] = []; // all subscription handles
  systemLookup: any = {};
  returnedFields: string[];

  constructor() {}

  ngOnInit() {
    this.messages = {
      emptyMessage: 'no data available in table',
      totalMessage: 'total'
    };

    Session.set('keywords', this.keywords);
    this.collection = this.Collections[0];

    let handle = MeteorObservable.autorun().subscribe(() => {
      this.handles.push(MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe());

      this.systemLookup = SystemLookups.collection.findOne({
          name: this.lookupName,
          tenantId: Session.get('tenantId')
        });
      this.returnedFields = this.systemLookup.returnedFields;
      Session.set('systemLookup', this.systemLookup);

      let handle = MeteorObservable.autorun().subscribe(() => {

        this.systemLookup = Session.get('systemLookup');
        if (this.systemLookup) {
          this.columns = this.getColumnsM(this.systemLookup);

          if (this.Collections.length > 1) {
            this.systemLookup.pipeline = this.processPipeline(this.systemLookup.pipeline);
            this.rows = this.getRowsM(this.systemLookup, this.columns, Session.get('keywords'));
          } else {
            this.limit = this.systemLookup.findOptions.limit;
            // set rows inside this function
            this.getRows(this.systemLookup, this.columns, Session.get('keywords'));
          }
        }
      })
      this.handles.push(handle);
    });
    this.handles.push(handle);

  }

  getColumnsM(systemLookup:any) {
    let arr = [];
    // select displayed columns to data table

    let dataTableOptions = systemLookup.dataTableOptions;

    systemLookup.dataTableOptions.forEach((column, index) => {
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

  // get rows for multiple system lookup
  getRowsM(systemLookup, columns, keywords) {
    let arr = [];
    let handle = MeteorObservable.call('getAggregations', Session.get('tenantId'), this.collection._collection._name,
      systemLookup.pipeline, columns, keywords)
        .subscribe((res:any[]) => {
          this.setArrWithKeys(columns, res, arr);
        });
    this.handles.push(handle);
    return arr;
  }

  // get rows for single system lookup
  getRows(systemLookup, columns, keywords) {
    let selector = this.getSelector();
    let options = systemLookup.findOptions;

    let handle = MeteorObservable.subscribe(this.lookupName, selector, options, keywords).subscribe();

      MeteorObservable.autorun().subscribe(() => {
        let fields = options.fields;
        let select;

        if (!keywords || keywords == '') {
          select = selector;
        } else {
          select = generateRegex(fields, keywords);
        }

        select.tenantId = selector.tenantId;

        options.fields.tenantId = 1;

        this.rows = [];
        this.collection.collection.find().forEach((item, index) => {
          this.rows[this.skip + index]= item;
        });

        this.count = Counts.get(this.lookupName);
      })


    this.handles.push(handle);

  }

  getSelector() {
    let selector = { tenantId: Session.get('tenantId')};
    return selector;
  }

  // get the rows data based on the columns prop.
  setArrWithKeys(columns: any[], rows: any[], arr: any[]) {
    rows.forEach((row, index) => {
      let obj = {};
      columns.forEach((column) => {
        obj[column.prop] = row[column.prop];
      });
      arr.push(obj);
    });
  }

  processPipeline(obj:any) {
    obj = JSON.stringify(obj);
    obj = obj.replace(/_\$/g, '$');
    obj = JSON.parse(obj);
    return obj;
  }

  search(keywords) {
    Session.set('keywords', keywords);
  }

  onSelect(event) {
    let selected = event.selected[0];
    let index = event.selected[0].$$index - this.offset*this.limit;
    let result = '';

    this.returnedFields.forEach(field => {
      if (field in selected) {
        result += selected[field];
      } else {
        result += field;
      }
    })

    // loop through the returnFields
    this.onSelected.emit(result);

  }

  onSort(event) {
    this.offset = 0;
    this.skip = 0;
    this.systemLookup.findOptions.skip = 0;
    let sortProp = event.sorts[0].prop;
    this.systemLookup.findOptions.sort = {};
    if (event.sorts[0].dir == 'asc') {
      this.systemLookup.findOptions.sort[sortProp] = 1;
    } else {
      this.systemLookup.findOptions.sort[sortProp] = -1;
    }
    Session.set('systemLookup', this.systemLookup);
  }

  onPage(event) {
    this.offset = event.offset;
    this.skip = event.offset * event.limit;
    this.systemLookup.findOptions.skip = this.skip;
    Session.set('systemLookup', this.systemLookup);
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
