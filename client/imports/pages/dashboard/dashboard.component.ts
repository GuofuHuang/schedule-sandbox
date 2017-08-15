import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeteorObservable } from "meteor-rxjs";
import { Event, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import * as _ from "underscore";

import 'rxjs/add/operator/filter';

import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';
import {SystemTenants} from "../../../../both/collections/systemTenants.collection";
import template from './dashboard.component.html';
import style from './dashboard.component.scss';

@Component({
  selector: 'dashboard',
  template,
  styles: [ style ]
})

export class DashboardComponent implements OnInit, OnDestroy {
  tenants: any[];
  selectedCompany: any;
  subscriptions: Subscription[] = [];
  label: string;

  public options = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    rtl: false,
    animate: 'scale',
    position: ['bottom', 'right']
  };

  breadcrumbs: Array<Object> = [];
  breadcrumbCollection: any[] = [];
  breadcrumbURL: string;

  constructor(private router: Router, private route:ActivatedRoute) {

  }

  titleKey: string;

  ngOnInit() {
    
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
