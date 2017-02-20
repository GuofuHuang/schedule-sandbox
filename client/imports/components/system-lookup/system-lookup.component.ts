import {Component, Input, Output, EventEmitter} from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {MeteorObservable} from 'meteor-rxjs';

import { SystemLookups } from '../../../../both/collections';
import { Customers } from '../../../../both/collections/customers.collection';
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

  constructor(public dialogRef: MdDialogRef<SystemLookupComponent>) {}

  ngOnInit() {
    this.selector = {
      $text: {
        $search: 'contractor'
      }
    };
    if (this.Collections.length == 1) {

      let collectionName = this.Collections[0]._collection._name;

      MeteorObservable.subscribe('systemLookups', this.lookupName).subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {

          SystemLookups.find({name: this.lookupName}).cursor
            .map(result => {
              this.systemLookup = result;
            });

          let systemLookup = this.systemLookup;
          this.collectionName = collectionName;
          let test = {};
          test['$text'] = {};
          test['$text']['$search'] = '0000000'
          let obj = {
            $text: {
              $search: '0000000'
            }
          }

          this.getTableData(collectionName, {},  systemLookup);

        });
      })
    }
  }

  getTableData(collectionName, selector, systemLookup) {
    MeteorObservable.subscribe(collectionName, selector, systemLookup.findOptions, systemLookup.dataTableOptions).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {

        let displayedFields = {
          fields: {},
          limit: 10,
          sort: {}
        };

        let arr = [];

        this.returnedFields = [];
        // select displayed columns to data table
        systemLookup.dataTableOptions.forEach((column, index) => {
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


        console.log(displayedFields);
        displayedFields.limit = systemLookup.findOptions.limit;
        displayedFields.sort = systemLookup.findOptions.sort;

        console.log(selector);

        this.Collections[0].find(selector, displayedFields)
          .subscribe(result => {
            console.log(result);
            this.rows = result;
          })
        displayedFields.fields = {};
        // this.Collections[0].find({}, displayedFields)
        //   .subscribe(result => {
        //     this.allData = result;
        //   })
      })
    })
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
    console.log(event.sorts[0].dir)
    if (event.sorts[0].dir == 'asc') {
      this.systemLookup.findOptions.sort[temp] = 1;
      console.log('it is ascending');
    } else {
      this.systemLookup.findOptions.sort[temp] = -1;
      console.log('it is descending');

    }

    this.getTableData(this.collectionName, {}, this.systemLookup);
  }

  search(keywords) {
    // let search = {
    //   $text: {
    //     $search: ''
    //   }
    // }
    // search.$text = {
    //   $search: "0000000"
    // }
    let obj = {
      $text: {
        $search: '0000000'
      }
    }

    console.log(keywords);
    this.getTableData(this.collectionName, obj,  this.systemLookup);
  }
}