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
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd ){
      MeteorObservable.call('returnBreadcrumbs').subscribe(collection => {
        console.log(collection);
        let  currentRoute = this.router.url.replace(/\/\s*$/,'').split('/');
        this.breadcrumbs = [];
        this.breadcrumbURL = undefined;
        for (let i = 0; i < currentRoute.length; i++) {

          let foundRouteInfo = _.find(collection["value"], function (obj) { return obj.url === currentRoute[i]; })
          if (foundRouteInfo !== undefined) {
            if (this.breadcrumbURL === undefined) {
              this.breadcrumbURL = "/" + foundRouteInfo.url
            } else {
              this.breadcrumbURL += "/" + foundRouteInfo.url
            }
            this.breadcrumbs.push({label: foundRouteInfo.breadcrumb, url: "/" + this.breadcrumbURL})
          } else {
            if (currentRoute[i].length === 17) {
              let indexOfId = currentRoute.indexOf(currentRoute[i])
              let IdCollection = currentRoute[indexOfId - 1],
                  individualId = currentRoute[indexOfId],
                  findCollection,
                  documentBreadcrumb

              for (let k = 0; k < collection["value"].length; k++) {
                  if (collection["value"][k].url === IdCollection) {
                    console.log(collection["value"][k])
                    documentBreadcrumb = collection["value"][k].documentBreadcrumb
                    findCollection = collection["value"][k].collection
                  }
              }
              console.log(findCollection);
              MeteorObservable.call('find', findCollection, {_id: individualId}).subscribe(info => {

                this.breadcrumbURL += "/" + individualId
                this.breadcrumbs.push({label: info[0][documentBreadcrumb], url: "/" + this.breadcrumbURL})
              })
            }
          }
        }
        // this.breadcrumbs.pop()
      })
    }
    });
  }

  titleKey: string;

  ngOnInit() {
    if (!Meteor.userId()) {
      if (this.router.url === 'login') {

      }
      console.log(window.location.href);
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
            removed: false,
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
