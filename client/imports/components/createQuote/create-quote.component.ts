import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { SystemOptions } from '../../../../both/collections/systemOptions.collection';
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

  constructor() {}

  ngOnInit() {

    this.customerCollections = [Customers];
    this.customerLookupName = 'customer';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'category';

    MeteorObservable.subscribe('systemTenants').subscribe(() => {



    })

    Meteor.call('getTenantIds', (err, res) => {
      console.log(err, res);
    })

    Meteor.subscribe('systemOptions', (err, res) => {
      console.log(err, res);
    })

  }


}