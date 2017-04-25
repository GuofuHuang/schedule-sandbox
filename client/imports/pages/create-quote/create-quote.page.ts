import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';
import { CustomerMeetings } from '../../../../both/collections/customerMeetings.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { Router } from '@angular/router';
import template from './create-quote.page.html';
import style from './create-quote.page.scss';

@Component({
  selector: 'create-quote',
  template,
  styles: [ style ]
})

export class CreateQuotePage implements OnInit {
  customerCollections: any[];
  categoryCollections: any[];
  userCollections: any[];
  customerLookupName: string;
  categoryLookupName: string;
  userLookupName: string;
  tenants: any[];

  constructor(private router: Router) {}

  ngOnInit() {

    let subdomain = Session.get('subdomain');

    this.customerCollections = [Customers];
    this.customerLookupName = 'customers';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'categories';
    this.userCollections = [Users];
    this.userLookupName = 'users1';
    // this.categoryCollections = [CustomerMeetings, Categories];
    // this.categoryLookupName = 'customerMeetings';

    // MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe();

    // MeteorObservable.subscribe('all_systemTenants', Session.get('parentTenantId')).subscribe(() => {
    //   this.tenants = SystemTenants.collection.find({}).fetch();
    //   console.log(this.tenants);
    //   // this.tenants.some((item, index) => {
    //   //   if (item.subdomain == subdomain) {
    //   //     this.selectedCompany = this.tenants[index];
    //   //     return true;
    //   //   }
    //   // })
    // })
  }

  onSelect(event) {
    let splitHost = window.location.host.split('.');
    let host = splitHost[splitHost.length-1];

    let newUrl = window.location.protocol + '//' + event.subdomain + '.' + host;
    console.log(newUrl);

    window.location.href = newUrl;
  }
}
