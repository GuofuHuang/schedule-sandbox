import { Component, OnInit } from '@angular/core';
import template from './app.component.html';
import style from './app.component.scss';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../both/collections/parties.collection';
import {SystemTenants} from "../../../both/collections/systemTenants.collection";
import {MeteorObservable} from "meteor-rxjs";

Parties.find().map(parties => {
  console.log(parties);
})

@Component({
  selector: 'app',
  template,
  styles: [ style ]
})

@InjectUser('user')
export class AppComponent implements OnInit{
  parties: Observable<any[]>;

  constructor() {}

  logout() {
    Meteor.logout();
  }

  ngOnInit() {
    let subdomain = window.location.host.split('.')[0];
    Session.set('subdomain', subdomain);
    Meteor.call('getTenantId', subdomain, (err, res) => {

    })


    MeteorObservable.subscribe('systemTenants').subscribe(() => {

      let tenants = SystemTenants.collection.find({}).fetch();
      tenants.some((item, index) => {
        if (item.subdomain == subdomain) {
          console.log(item);
          Session.set('tenantId', item._id);
          console.log(Session.get('tenantId'));
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
