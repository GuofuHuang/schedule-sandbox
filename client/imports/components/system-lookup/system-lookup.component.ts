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

  rows: Object[];
  columns: any[];
  systemLookup: any;
  returnedFields: any;
  allData: Object[];

  constructor(public dialogRef: MdDialogRef<SystemLookupComponent>) {}

  ngOnInit() {
    if (this.Collections.length == 1) {

      let collectionName = this.Collections[0]._collection._name;

      MeteorObservable.subscribe('systemLookups', this.lookupName).subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {

          SystemLookups.find({name: this.lookupName}).cursor
            .map(result => {
              this.systemLookup = result;
            });

          let dataTableOptions = [];
          dataTableOptions = this.systemLookup.dataTableOptions;

          MeteorObservable.subscribe(collectionName, this.systemLookup.findOptions, this.systemLookup.dataTableOptions).subscribe(() => {
            MeteorObservable.autorun().subscribe(() => {

              let displayedFields = {
                fields: {}
              };

              let arr = [];

              this.returnedFields = [];
              // select displayed columns to data table
              dataTableOptions.forEach((column, index) => {
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

              this.rows = this.Collections[0].find({}, displayedFields).cursor
                .map(result => {
                  return result;
                });
              this.allData = this.Collections[0].find({}).cursor
                .map(result => {
                  return result;
                });
            })
          })
        });
      })
    }
  }

  onSelect(event) {
    let index = event.selected[0].$$index;
    let selected = this.allData[index];
    console.log(this.returnedFields);
    let result;
    for (let i = 0; i < this.returnedFields.length; i++){

      if (i == 0) {
        result = selected[this.returnedFields[i]];

      } else {
        result = result + ' - ' + selected[this.returnedFields[i]];
      }
    }
    this.onSelected.emit(result);
  }
}