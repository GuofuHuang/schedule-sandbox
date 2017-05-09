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
    // router.events.subscribe((val) => {
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd ){
      MeteorObservable.call('returnBreadcrumbs').subscribe(collection => {
        let  currentRoute = this.router.url.replace(/\/\s*$/,'').split('/')
        this.breadcrumbs = []
        this.breadcrumbURL = undefined
        for (let i = 0; i < currentRoute.length; i++) {
          for (let j = 0; j < collection["value"].length; j++) {
            if (currentRoute[i] === collection["value"][j].url) {
              let url = collection["value"][j].url
              if (this.breadcrumbURL === undefined) {
                this.breadcrumbURL = "/" + collection["value"][j].url
              } else {
                this.breadcrumbURL += "/" + collection["value"][j].url
              }
              this.breadcrumbs.push({label: collection["value"][j].breadcrumb, url: "/" + this.breadcrumbURL})
            }
          }
          if (currentRoute[i].length === 17) {
              let IdCollection = currentRoute[currentRoute.length - 2],
                  individualId = currentRoute[currentRoute.length - 1],
                  findCollection

              for (let k = 0; k < collection["value"].length; k++) {
                  if (collection["value"][k].url === IdCollection) {
                    findCollection = collection["value"][k].collection
                  }
              }
              MeteorObservable.call('find', findCollection, {_id: individualId}).subscribe(info => {
                this.breadcrumbURL += "/" + individualId
                this.breadcrumbs.push({label: info[0].name, url: "/" + this.breadcrumbURL})
                console.log("hit")
              })
          }
        }
        console.log("POP")
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
