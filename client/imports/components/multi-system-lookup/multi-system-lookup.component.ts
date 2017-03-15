import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import template from './multi-system-lookup.component.html';
import { SystemLookups } from '../../../../both/collections';
import {MeteorObservable} from "meteor-rxjs";

@Component({
  selector: 'multi-system-lookup',
  template
})

export class MultiSystemLookup implements OnInit, OnDestroy {
  @Input() collections: any[];
  @Input() collection: any;
  @Input() lookupName: string;
  @Output() onSelected = new EventEmitter<string>();

  rows: any[] = []; // row data to be displayed in the data table
  columns: any[] = []; // headers in the data table
  selector: any = {}; // selector for the mognodb collection search
  keywords: string; // keywords to search the database

  start: number = 0; // start index for the rows displayed in the data table
  count: number = 10; // count for the data table
  offset: number = 0; // offset for the data table
  limit: number = 0; // limit for the data table
  messages: any; // messages for data table
  handle: Subscription; // handle the subscription
  handle1: Subscription; // handle the subscription
  handle2: Subscription; // handle the subscription

  constructor() {}

  ngOnInit() {

    this.handle = MeteorObservable.subscribe('systemLookups', this.lookupName).subscribe(() => {
      this.handle1 = MeteorObservable.autorun().subscribe(() => {

        let systemLookup = SystemLookups.collection.findOne({name: this.lookupName});
        systemLookup.pipeline = this.processPipeline(systemLookup.pipeline);
        this.columns = this.getColumns(systemLookup);
        this.rows = this.getRows(systemLookup, this.columns);
      });
    })
  }

  getColumns(systemLookup) {
    let arr = [];
    // select displayed columns to data table

    let dataTableOptions = systemLookup.dataTableOptions;

    systemLookup.dataTableOptions.forEach((column, index) => {
      let obj = {};
      if (!column.hidden) {
        Object.keys(column).forEach(key => {
          obj[key] = column[key];
        });
        console.log(obj);
        arr.push(obj);
      }
    });

    return arr;

    // let selector = {tenantId: Session.get('tenantId')};
    // let tenantId = Meteor.userId();
    // systemLookup.findOptions.forEach(findCollection => {
    //   let fetchedCollection;
    //   this.collections.some(collection => {
    //     if (collection._collection._name == findCollection.collectionName) {
    //       fetchedCollection = collection;
    //
    //       // console.log(findCollection);
    //       let option:any = {};
    //       option.fields = findCollection.fields;
    //       MeteorObservable.subscribe(findCollection.collectionName, {tenantId: Session.get('tenantId')}, option, '').subscribe();
    //       // console.log(fetchedCollection.find({}, findCollection.fields).cursor.fetch());
    //
    //       return true;
    //     }
    //   })
    //
    // })
  }

  getRows(systemLookup, columns) {

    let arr = [];

    this.handle2 = MeteorObservable.call('getAggregations', this.collection._collection._name, systemLookup.pipeline)
      .subscribe((res:any[]) => {
        this.setArrWithKeys(columns, res, arr);
      });
    return arr;
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

  extractAggregates(obj: any[]) {
    console.log(obj);
    obj.forEach(field => {
      console.log(field.aggregate);
    })
  }

  processPipeline(obj:any) {
    obj = JSON.stringify(obj);
    obj = obj.replace(/_\$/g, '$');
    obj = JSON.parse(obj);
    return obj;

  }

  ngOnDestroy() {
    this.handle.unsubscribe();
    this.handle1.unsubscribe();
    this.handle2.unsubscribe();
  }
}