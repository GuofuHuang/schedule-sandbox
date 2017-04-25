import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import {MeteorObservable} from "meteor-rxjs";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';




import {SystemTenants} from "../../../../both/collections/systemTenants.collection";
import template from './dashboard.component.html';
import style from './dashboard.component.scss';
@Component({
  selector: 'dashboard',
  template,
  styles: [ style ]

})

export class DashboardComponent implements OnInit, OnDestroy {
  customerCollections: any[];
  categoryCollections: any[];
  customerLookupName: string;
  categoryLookupName: string;

  tenants: any[];
  selectedCompany: any;
  public subscriptions: Subscription[] = [];

  label: string;
  constructor(private router: Router) { }

  ngOnInit() {
    console.log('dashboard');
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

      this.subscriptions[0] = MeteorObservable.autorun().subscribe(() => {
        let parentTenantId = Session.get('parentTenantId');
        if (parentTenantId) {
          let query = {
            $or: [
              {
                _id: parentTenantId
              },
              {
                parentTenantId: parentTenantId
              }
            ]
          };
          this.subscriptions[1] = MeteorObservable.subscribe('systemTenants', query, {}, '').subscribe(() => {
            this.subscriptions[2] = MeteorObservable.autorun().subscribe(() => {
              this.tenants = SystemTenants.collection.find({}).fetch();
              this.tenants.some((item, index) => {
                if (item.subdomain == subdomain) {
                  this.selectedCompany = this.tenants[index];
                  return true;
                }
              })
            })
          })
        }
      })
    }
  }

  onSelect(event) {
    Session.set('tenantId', event._id);
    // let splitHost = window.location.host.split('.');
    //
    // let url = event.subdomain;
    // if (splitHost.length != 1) {
    //   splitHost.forEach((item, index) => {
    //     if (index != 0) {
    //       url += '.' + splitHost[index];
    //     }
    //   })
    // } else {
    //   url += '.' + splitHost[0];
    // }
    //
    // let newUrl = window.location.protocol + '//' + url;
    //
    // window.location.href = newUrl;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}