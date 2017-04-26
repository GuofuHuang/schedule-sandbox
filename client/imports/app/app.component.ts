/*
 This component gets the parentTenantId and store it in the Session which will be used later.

 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import template from './app.component.html';
import style from './app.component.scss';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import {SystemTenants} from "../../../both/collections/systemTenants.collection";
import {MeteorObservable} from "meteor-rxjs";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app',
  template,
  styles: [ style ]
})

@InjectUser('user')
export class AppComponent implements OnInit, OnDestroy {
  parties: Observable<any[]>;
  isLogin: boolean = false;
  public subscriptions: Subscription[] = [];

  constructor(private router: Router, private _location: Location) {

  }

  logout() {
    Meteor.logout();
  }

  ngOnInit() {
    console.log('app');
    // subscribe the current user to get needed info
    MeteorObservable.subscribe('currentUser').subscribe();

    let subdomain = window.location.host.split('.')[0];
    Session.set('subdomain', subdomain);

    if (Meteor.userId()) {

      let tenant;
      let query = {
        subdomain
      };
      this.subscriptions[0] = MeteorObservable.subscribe('systemTenants', query, {}, '').subscribe(() => {
        this.subscriptions[1] = MeteorObservable.autorun().subscribe(() => {
          tenant = SystemTenants.collection.findOne(query);
          if (tenant) {
            Session.set('parentTenantId', tenant._id);
            Session.set('tenantId', tenant._id);
          }
        })
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}
