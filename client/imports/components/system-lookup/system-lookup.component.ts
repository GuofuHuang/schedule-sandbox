import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from "meteor-rxjs";
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './system-lookup.component.html';
import { SystemLookups } from '../../../../both/collections';
import { SystemLookup } from '../../../../both/models/systemLookup.model';
import Dependency = Tracker.Dependency;

@Component({
  selector: 'system-lookup',
  template
})

export class SystemLookupComponent implements OnInit, OnDestroy {
  @Input() Collections: any[];
  @Input() collection: any;
  @Input() lookupName: string;
  @Output() onSelected = new EventEmitter<string>();
  @Output() onReturn = new EventEmitter<{}>();

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
  handles: Subscription[]; // all subscription handles
  systemLookup: any = {};
  dataTableOptions: any = {};
  returnData: string[];
  selected: any[] = [];
  lookupDep: Dependency = new Dependency(); // keywords dependency to invoke a search function
  keywordsDep: Dependency = new Dependency(); // keywords dependency to invoke a search function

  constructor() {}

  ngOnInit() {
    this.messages = {
      emptyMessage: 'no data available in table',
      totalMessage: 'total'
    };
    this.handles = [];

    this.collection = this.Collections[0];

    let handle = MeteorObservable.autorun().subscribe(() => {

      this.handles.push(MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe());

      // console.log(this.systemLookup);
      this.systemLookup = SystemLookups.collection.findOne({
        name: this.lookupName,
        tenantId: Session.get('tenantId')
      });

      let handle = MeteorObservable.autorun().subscribe(() => {

        // put dependency here

        this.keywordsDep.depend();
        this.lookupDep.depend();

        // this.dataTableOptions = this.systemLookup.dataTableOptions;

        if (this.systemLookup) {
          this.columns = this.getColumnsM(this.systemLookup);
          this.dataTableOptions = this.systemLookup.dataTable.table;

          // {
          //   $$index: 0,
          //   _id: "44RccJQuPpxuAjw6o",
          //   tenants: [
          //     "4sdRt09goRP98e456"
          //   ],
          //   username: "NO EMAIL"
          //
          // }
          this.selected = [];
          if (this.Collections.length > 1) {

            this.systemLookup.multi.pipeline = this.processPipeline(this.systemLookup.multi.pipeline);
            this.getRowsM(this.systemLookup, this.columns, this.keywords);
          } else {
            this.limit = this.systemLookup.single.findOptions.limit;
            // set rows inside this function
            this.getRows(this.systemLookup, this.columns, this.keywords);
            this.selected = [];

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

  // get rows for multiple system lookup
  getRowsM(systemLookup, columns, keywords) {
    let arr = [];
    let handle = MeteorObservable.call('getAggregations', Session.get('tenantId'), this.collection._collection._name,
      systemLookup.multi.pipeline, columns, keywords)
        .subscribe((res:any[]) => {
          res.forEach((row, index) => {
            let obj = {};
            columns.forEach((column) => {
              obj[column.prop] = row[column.prop];
            });
            arr.push(obj);
          });
          this.limit = 10;
          this.count = arr.length;
          this.rows = arr;
        });


    this.handles.push(handle);
    return arr;
  }

  // get rows for single system lookup
  getRows(systemLookup, columns, keywords) {
    let selector = this.getSelector(systemLookup);
    let options = systemLookup.single.findOptions;

    let handle = MeteorObservable.subscribe(this.lookupName, selector, options, keywords).subscribe();

      MeteorObservable.autorun().subscribe(() => {
        let fields = options.fields;
        let select;

        if (!keywords || keywords == '') {
          select = selector;
        } else {
          select = generateRegex(fields, keywords);
        }

        this.rows = [];
        options.skip = 0;
        this.collection.collection.find(select, options).forEach((item, index) => {
          this.rows[this.skip + index]= item;
        });

        this.count = Counts.get(this.lookupName);
      })


    this.handles.push(handle);

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

  processPipeline(obj:any) {
    obj = JSON.stringify(obj);
    obj = obj.replace(/_\$/g, '$');
    obj = JSON.parse(obj);
    return obj;
  }

  search(keywords) {
    this.keywords = keywords;
    this.lookupDep.changed();

  }

  onSelect(event) {
    if (this.Collections.length == 1) {
      if ('returnData' in this.systemLookup.single && this.systemLookup.single.returnData.length > 0) {
        let selected = event.selected[0];
        let index = event.selected[0].$$index - this.offset*this.limit;
        let result = '';

        this.returnData = this.systemLookup.single.returnData;

        this.returnData.forEach(field => {
          if (field in selected) {
            result += selected[field];
          } else {
            result += field;
          }
        })

        // loop through the returnFields
        this.onSelected.emit(selected);

      }

    }
  }

  add() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  onSort(event) {
    let sortProp = event.sorts[0].prop;
    this.offset = 0;
    this.skip = 0;

    if (this.Collections.length > 1) {
      let sort = {$sort: {}};

      if (event.sorts[0].dir == 'asc') {
        sort.$sort[sortProp] = 1;
      } else {
        sort.$sort[sortProp] = -1;
      }

      this.systemLookup.multi.pipeline.push(sort);
    } else {
      this.systemLookup.single.findOptions.skip = 0;
      this.systemLookup.single.findOptions.sort = {};
      if (event.sorts[0].dir == 'asc') {
        this.systemLookup.single.findOptions.sort[sortProp] = 1;
      } else {
        this.systemLookup.single.findOptions.sort[sortProp] = -1;
      }
    }


    this.lookupDep.changed();
  }

  onPage(event) {
    this.offset = event.offset;
    this.skip = event.offset * event.limit;
    this.systemLookup.single.findOptions.skip = this.skip;
    this.keywordsDep.changed();
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
