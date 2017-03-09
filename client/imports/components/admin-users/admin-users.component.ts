import { Component, OnInit } from '@angular/core';
import template from './admin-users.component.html';
import style from './admin-users.component.scss';

import { MeteorObservable } from 'meteor-rxjs';
import { Router } from '@angular/router';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { Users } from '../../../../both/collections/users.collection';

@Component({
  selector: 'admin-users',
  template,
  styles: [ style ]
})

export class adminUsersComponent implements OnInit{
  userCollections: any[];
  userLookupName: string;

  tenants: any[];
  selectedCompany: any;
  listUsers: any;

  constructor(private router: Router) {}

  ngOnInit() {

    if (!Meteor.userId()) {
      this.router.navigate(['/login']);
    }

    let subdomain = Session.get('subdomain');
    this.userCollections = [Users];
    this.userLookupName = 'adminUsers';

    MeteorObservable.subscribe('users').subscribe(() => {
      this.listUsers = Users.collection.find({}).fetch()
    })

    MeteorObservable.subscribe('systemTenants').subscribe(() => {
      this.tenants = SystemTenants.collection.find({}).fetch();
      this.tenants.some((item, index) => {
        if (item.subdomain == subdomain) {
          this.selectedCompany = this.tenants[index];
          return true;
        }
      })
    })

    console.log(this)


  }
}
