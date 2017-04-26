import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeteorObservable } from "meteor-rxjs";
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
  public tenants: any[];
  public selectedCompany: any;
  public subscriptions: Subscription[] = [];
  public label: string;

  constructor(private router: Router) { }

  ngOnInit() {
    if (!Meteor.userId()) {
      if (this.router.url === 'login') {

      }
      this.router.navigate(['login']);
      return;
    }

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}