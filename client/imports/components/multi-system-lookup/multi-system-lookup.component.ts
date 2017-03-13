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

  constructor() {}

  ngOnInit() {

    // this.columns = [
    //   { prop: 'name' },
    //   { name: 'Gender' },
    //   { name: 'Company' }
    // ];
    //
    this.handle = MeteorObservable.subscribe('systemLookups', this.lookupName).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        let systemLookup = SystemLookups.collection.findOne({name: this.lookupName});
        this.columns = this.getColumns(systemLookup);
        this.rows = this.getRows(systemLookup, this.columns);

      });
    })
  }

  getColumns(systemLookup) {
    let arr = [];
    // select displayed columns to data table
    systemLookup.dataTableOptions.forEach((column, index) => {
      // console.log(column, index);
      if (!column.hidden) {
        let obj = {
          prop: column.fieldName,
          name: column.label,
          width: column.width
        }

        arr.push(obj);
        // displayedFields.fields[column.fieldName] = 1;
      }
      if (column.returned) {
        // this.returnedFields[index] = column.fieldName;
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

    MeteorObservable.call('getAggregations').subscribe((res:any[]) => {
      res.forEach(item => {
        console.log(item);
        let obj = {
          customer: item.customer.name,
          dateTime: item.dateTime,
          profile: item.user.profile.firstName + ' ' + item.user.profile.lastName,
          branch: ''
        };
        if (item.branchId) {
          obj.branch = item.newBranch[0].address1;
        }

        arr.push(obj);

      })
    });
    return arr;

    // Meteor.call('getAggregations', (err, res:any[]) => {
    //   res.forEach(item => {
    //     arr.push({
    //       customer: item.customer.name,
    //       dateTime: item.dateTime,
    //       profile: item.user.profile.firstName + item.user.profile.lastName
    //     })
    //   })
    //   console.log(arr);
    //   this.rows = arr;
    //   return arr;
    // });
  }

  ngOnDestroy() {
    this.handle.unsubscribe();
  }


}