import { Component, OnInit } from '@angular/core';

import { Categories } from "../../../../both/collections";
import { Customers } from '../../../../both/collections/customers.collection';
import template from './create-quote.component.html';
import style from './create-quote.component.scss';
import { Counts } from 'meteor/tmeasday:publish-counts';

@Component({
  selector: 'create-quote',
  template,
  styles: [ style ]
})

export class CreateQuoteComponent implements OnInit {
  customerCollections: any[];
  categoryCollections: any[];
  customerLookupName: string;
  categoryLookupName: string;

  rows: any[];
  columns: any[];
  count: number = 0;

  constructor() {}

  ngOnInit() {

    this.rows = [
      { name: 'Austin', gender: 'Male', company: 'Swimlane' },
      { name: 'Dany', gender: 'Male', company: 'KFC' },
      { name: 'Molly', gender: 'Female', company: 'Burger King' },
    ];
    this.columns = [
      { prop: 'name' },
      { name: 'Gender' },
      { name: 'Company' }
    ];

    this.count = 3;

    this.customerCollections = [Customers];
    this.customerLookupName = 'customer';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'category';
  }
  call() {
    console.log(Counts.get('numberOfcustomers'));
  }
}
//
//
// import selectCustomer from './select-customer.html';
//
// @Component({
//   selector: 'dialog-select-customer',
//   template: selectCustomer
// })
//
// export class DialogSelectCustomer{
//   rows: Object[];
//   columns: any[];
//   collectionName: string;
//   Collections: any[];
//   options: Object;
//   fields: Object;
//
//   constructor(public dialogRef: MdDialogRef<DialogSelectCustomer>) {
//   }
// }
