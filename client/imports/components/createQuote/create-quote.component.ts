import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import {Observable} from 'rxjs';
import {MeteorObservable} from 'meteor-rxjs';

import { DialogComponent } from '../dialog/dialog.component';
import { Categories } from "../../../../both/collections";
import {User} from "../../../../both/models/user.model";
import { Customers } from '../../../../both/collections/customers.collection';
import { Customer } from '../../../../both/models/customer.model';
import template from './create-quote.component.html';
import style from './create-quote.component.scss';

import { SystemLookupComponent } from '../system-lookup/system-lookup.component';



@Component({
  selector: 'create-quote',
  template,
  styles: [ style ]
})

export class CreateQuoteComponent implements OnInit {
  selectedOption: string;
  users: User[];
  customers: any[];

  constructor(public dialog: MdDialog) {  }

  ngOnInit() {}

  selectCustomer() {
    // let fields = {
    //   customer: 1,
    //   name: 1,
    //   zipCode: 1,
    //   city: 1,
    //   state: 1
    // };
    //
    // let limit = 10;
    //
    // let options = {
    //   limit: limit,
    //   fields: fields
    // }


    let dialogRef = this.dialog.open(DialogComponent, {
      height: "600px",
      width: "800px"
    });
    dialogRef.componentInstance.Collections = [Customers];

    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  selectProductLine() {
    // let fields = {
    //   customer: 1,
    //   name: 1,
    //   zipCode: 1,
    //   city: 1,
    //   state: 1
    // };
    //
    // let limit = 10;
    //
    // let options = {
    //   limit: limit,
    //   fields: fields
    // }

    let dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.componentInstance.Collections = [Categories];

    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  openDialog() {
  }
}

//
// import selectCustomer from './select-customer.html';
//
// @Component({
//   selector: 'dialog-select-customer',
//   template: selectCustomer
// })
//
// export class DialogSelectCustomer implements OnInit{
//   rows: Object[];
//   columns: any[];
//   collectionName: string;
//   Collections: any[];
//   options: Object;
//   fields: Object;
//
//   constructor(public dialogRef: MdDialogRef<DialogSelectCustomer>) {
//   }
//
//   ngOnInit() {
//
//     let arr = [];
//     console.log
//
//     Object.keys(this.fields).forEach(function(key, index) {
//       let obj = {
//         prop: key
//       }
//       arr.push(obj);
//     })
//
//     this.columns = arr;
//
//     MeteorObservable.subscribe(this.collectionName, this.options).subscribe(() => {
//       MeteorObservable.autorun().subscribe(() => {
//         this.rows = this.Collections[0].find({}).cursor
//           .map(result => {
//             return result;
//           });
//       })
//     })
//   }
// }
