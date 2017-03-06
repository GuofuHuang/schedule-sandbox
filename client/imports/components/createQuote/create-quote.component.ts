import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
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
  tenants: any[];
  selectedCompany: any;

  constructor() {}

  ngOnInit() {
    let subdomain = Session.get('subdomain');

    this.customerCollections = [Customers];
    this.customerLookupName = 'customer';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'category';

    MeteorObservable.subscribe('systemTenants').subscribe(() => {

      this.tenants = SystemTenants.collection.find({}).fetch();
      this.tenants.some((item, index) => {
        if (item.subdomain == subdomain) {
          this.selectedCompany = this.tenants[index];
          return true;
        }
      })
    })

    Meteor.call('getTenantIds', (err, res) => {
    })

    Meteor.subscribe('systemOptions', (err, res) => {
    })

    Meteor.call('test', 'customers', (err, res) => {
      console.log(err, res);
    })

  }

  onSelect(event) {
    let host = window.location.host.split('.')[1];

    let newUrl = window.location.protocol + '//' + event.subdomain + '.' + host;
    console.log(newUrl);

    window.location.href = newUrl;
  }
}