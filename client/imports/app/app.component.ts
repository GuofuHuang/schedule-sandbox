/*
 This component gets the parentTenantId and store it in the Session which will be used later.

 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import template from './app.component.html';
import style from './app.component.scss';
// import style from './test.css';
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
  styleUrls: [
    '../../../node_modules/@swimlane/ngx-datatable/release/index.css'
  ]
  // styles: [ style ]
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
    // subscribe the current user to get needed info
    MeteorObservable.subscribe('currentUser').subscribe();

    let subdomain = window.location.host.split('.')[0];
    Session.set('subdomain', subdomain);

    if (Meteor.userId()) {
      let tenant;
      let query = {
        subdomain
      };
      MeteorObservable.call('findOne', 'systemTenants', query, {}).subscribe((res:any) => {
        if (res) {
          Session.set('parentTenantId', res._id);
          Session.set('tenantId', res._id);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}
