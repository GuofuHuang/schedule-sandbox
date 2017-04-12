import { Component, OnInit } from '@angular/core';
import template from './app.component.html';
import style from './app.component.scss';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../both/collections/parties.collection';
import {SystemTenants} from "../../../both/collections/systemTenants.collection";
import {MeteorObservable} from "meteor-rxjs";
import { Router } from '@angular/router';

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
  isLogin: boolean = false;

  constructor(private router: Router) {

  }

  logout() {
    Meteor.logout();
  }

  ngOnInit() {
    // subscribe the current user to get needed info
    MeteorObservable.subscribe('currentUser').subscribe();

    if (Meteor.userId()) {
      this.isLogin = true;
    } else {
      console.log('not login')
      this.isLogin = false;
    }

    if (!Meteor.userId()) {
      this.router.navigate(['/login']);
    }

    let subdomain = window.location.host.split('.')[0];
    Session.set('subdomain', subdomain);

    if (Meteor.userId()) {

      let tenant;
      MeteorObservable.subscribe('parentTenant', subdomain).subscribe(() => {
        tenant = SystemTenants.collection.findOne({subdomain: subdomain});
        Session.set('parentTenantId', tenant._id);
        Session.set('tenantId', tenant._id);
      });

      MeteorObservable.subscribe('childTenants', Session.get('parentTenantId')).subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {
          let tenants = SystemTenants.collection.find({parentTenantId: Session.get('parentTenantId')}).fetch();
          Session.set('tenants', tenants);
        })
      })
    }
  }

}
