import { Component, Input, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import {MeteorObservable} from "meteor-rxjs";
import { Router } from '@angular/router';




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
  constructor(private router: Router) { }

  ngOnInit() {
    if (!Meteor.userId()) {
      console.log(this.router.url);
      if (this.router.url === 'login') {

      }
      // this.router.navigate(['']);
      console.log(window.location.href);
      this.router.navigate(['login']);
      return;
    }

    this.customerCollections = [Customers];
    this.customerLookupName = 'customer';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'category';


    let subdomain = window.location.host.split('.')[0];
    Session.set('subdomain', subdomain);

    if (Meteor.userId()) {

      let query = {
        subdomain
      }
      MeteorObservable.call('findOne', 'systemTenants', query, {}).subscribe((res:any) => {
        console.log(res);
        let query = {
          $or: [
            {
              _id: res._id
            },
            {
              parentTenantId: res._id
            }
          ]
        }
        MeteorObservable.subscribe('systemTenants', query, {}, '').subscribe(() => {
          this.tenants = SystemTenants.collection.find({}).fetch();
          this.tenants.some((item, index) => {
            if (item.subdomain == subdomain) {
              this.selectedCompany = this.tenants[index];
              return true;
            }
          })
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

    let url = event.subdomain;
    if (splitHost.length != 1) {
      splitHost.forEach((item, index) => {
        if (index != 0) {
          url += '.' + splitHost[index];
        }
      })
    } else {
      url += '.' + splitHost[0];
    }

    let newUrl = window.location.protocol + '//' + url;

    window.location.href = newUrl;
  }

}