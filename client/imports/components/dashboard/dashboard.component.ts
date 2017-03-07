import { Component, Input, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import {MeteorObservable} from "meteor-rxjs";




import {SystemTenants} from "../../../../both/collections/systemTenants.collection";
import template from './dashboard.component.html';
import style from './dashboard.component.scss';
@Component({
  selector: 'dashboard',
  template,
  styles: [ style ]

})

export class DashboardComponent implements OnInit {
  customerCollections: any[];
  categoryCollections: any[];
  customerLookupName: string;
  categoryLookupName: string;

  tenants: any[];
  selectedCompany: any;

  label: string;
  constructor() { }

  ngOnInit() {

    this.customerCollections = [Customers];
    this.customerLookupName = 'customer';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'category';


    let subdomain = window.location.host.split('.')[0];
    Session.set('subdomain', subdomain);

    if (Meteor.userId()) {

      MeteorObservable.subscribe('systemTenants').subscribe(() => {
        this.tenants = SystemTenants.collection.find({}).fetch();
        this.tenants.some((item, index) => {
          if (item.subdomain == subdomain) {
            this.selectedCompany = this.tenants[index];
            return true;
          }
        })
      })

      MeteorObservable.autorun().subscribe(() => {
        SystemTenants.collection.find().map(item => {

        })

      })

    }

  }

  onSelect(event) {
    let splitHost = window.location.host.split('.');
    console.log(window.location);
    console.log(event.subdomain);
    console.log(splitHost);
    let url = event.subdomain;
    splitHost.forEach((item, index) => {
      if (index != 0) {
        url += '.' + splitHost[index];
      }
    })

    console.log(url);

    let newUrl = window.location.protocol + '//' + url;
    console.log(newUrl);

    //window.location.href = newUrl;
  }

}