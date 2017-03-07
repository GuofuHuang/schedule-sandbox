import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  ngOnInit() {

    if (!Meteor.userId()) {
      this.router.navigate(['/login']);
    }

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


  }

  onSelect(event) {
    let splitHost = window.location.host.split('.');
    console.log(window.location);
    console.log(event.subdomain);
    console.log(splitHost);
    let host = splitHost[splitHost.length-1];

    let newUrl = window.location.protocol + '//' + event.subdomain + '.' + host;
    console.log(newUrl);

    window.location.href = newUrl;
  }
}