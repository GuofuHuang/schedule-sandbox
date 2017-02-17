import { Component, OnInit } from '@angular/core';

import { Categories } from "../../../../both/collections";
import { Customers } from '../../../../both/collections/customers.collection';
import template from './create-quote.component.html';
import style from './create-quote.component.scss';

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

  constructor() {}

  ngOnInit() {
    this.customerCollections = [Customers];
    this.customerLookupName = 'customer';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'category';
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
