import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import {Observable} from 'rxjs';

import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';
import { Customer } from '../../../../both/models/customer.model';
import template from './create-quote.component.html';
import style from './create-quote.component.scss';

@Component({
  selector: 'create-quote',
  template,
  styles: [ style ]
})

export class CreateQuoteComponent implements OnInit {
  selectedOption: string;
  test: Observable<any[]>;

  constructor(public dialog: MdDialog) {  }

  ngOnInit() {
    Customers.find({})
      .map(customers => {
        return customers.length
      })
      .subscribe(todoCount => console.log(todoCount));
    this.test = Customers.find().zone();
    console.log(this.test);



  }

  selectCustomer() {
    let dialogRef = this.dialog.open(DialogSelectCustomer);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  selectProductLine() {
    let dialogRef = this.dialog.open(DialogSelectProductLine);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });

  }

  openDialog() {
  }
}


import selectCustomer from './select-customer.html';

@Component({
  selector: 'dialog-select-customer',
  template: selectCustomer
})

export class DialogSelectCustomer {
  constructor(public dialogRef: MdDialogRef<DialogSelectCustomer>) {}
}


import selectProductLine from './select-product-line.html';

@Component({
  selector: 'dialog-select-product-line',
  template: selectProductLine
})
export class DialogSelectProductLine {
  constructor(public dialogRef: MdDialogRef<DialogSelectProductLine>) {}
}
