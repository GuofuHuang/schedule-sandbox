import {Component, Input, OnInit} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import {MeteorObservable} from 'meteor-rxjs';

import { SystemLookups } from '../../../../both/collections';
import template from './system-lookup.component.html';

@Component({
  selector: 'system-lookup',
  template
})

export class SystemLookupComponent {
  @Input() Collections: any[];
  @Input() user: any;

  rows: Object[];
  columns: any[];
  systemLookup: any;

  constructor(public dialogRef: MdDialogRef<SystemLookupComponent>) {
  }

  ngOnInit() {

    if (this.Collections.length == 1) {

      let collectionName = this.Collections[0]._collection._name;

      MeteorObservable.subscribe('systemLookups', collectionName).subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {

          SystemLookups.find({collection: collectionName}).cursor
            .map(result => {
              this.systemLookup = result;
            });

          let fields = this.systemLookup.findOptions.fields;
          let dataTableOptions = [];
          dataTableOptions = this.systemLookup.dataTableOptions;

          MeteorObservable.subscribe(collectionName, this.systemLookup.findOptions, this.systemLookup.dataTableOptions).subscribe(() => {
            MeteorObservable.autorun().subscribe(() => {

              let displayedFields = {
                fields: {}
              };

              let arr = [];

              // select displayed columns to data table
              dataTableOptions.forEach(column => {
                if (!column.hidden) {
                  let obj = {
                    prop: column.fieldName
                  }
                  arr.push(obj);
                  displayedFields.fields[column.fieldName] = 1;
                }
              })

              this.columns = arr;

              this.rows = this.Collections[0].find({}, displayedFields).cursor
                .map(result => {
                  return result;
                });
            })
          })
        });
      })
    }
  }
}