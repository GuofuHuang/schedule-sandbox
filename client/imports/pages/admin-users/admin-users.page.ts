import { Component, OnInit, Input, EventEmitter} from '@angular/core';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import {MeteorObservable} from "meteor-rxjs";

import template from './admin-users.page.html';
import style from './admin-users.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-users',
  template,
  styles: [ style ]
})

export class adminUsersPage implements OnInit{

  userCollections: any[];
  userLookupName: string;

  foods = [
    {
      value: {
        $in: [null, false]
      },
      viewValue: 'active users'
    },
    {
      value: true,
      viewValue: 'removed users'
    }
  ];

  dataObj: {};
  data: any = {
    value: {
      $in: [null, false]
    }
  };
  firstNameInput: string;
  lastNameInput: string;
  emailInput: string;
  passwordInput: string;
  groups = {};
  tenants: any = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.userCollections = [Users];
    this.userLookupName = 'users';
    let selector = {
      $or: [
        {
          _id: Session.get('parentTenantId'),
        },
        {
          parentTenantId: Session.get('parentTenantId')
        }
      ]
    };
    let args = [selector];

  }

  returnResult(event) {

    console.log(event);
    this.router.navigate(['/adminUsers/' + event._id]);
  }

  addUser() {
    let tenants = this.tenants.map(tenant => {
      let temp = {
        _id: tenant._id,
        enabled: false,
        groups: [""]
      };
      return temp;
    });

    this.dataObj = {
      tenants: tenants,
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      email: this.emailInput,
      password: this.passwordInput
    }

    if (this.firstNameInput !== undefined && this.lastNameInput !== undefined && this.emailInput !== undefined && this.passwordInput !== undefined) {
      if (this.firstNameInput.length > 0 && this.lastNameInput.length > 0 && this.emailInput.length > 0 && this.passwordInput.length > 0) {
        MeteorObservable.call('addUser', this.dataObj).subscribe(_id => {
          if (_id) {
            let query = {
              _id: _id
            };
            let update = {
              $set:{
                manages: [],
                tenants: tenants,
                parentTenantId: Session.get('parentTenantId')
              }
            };
            let args = [query, update];
            MeteorObservable.call('update', 'users', ...args).subscribe((res) => {
              if (res) {
                this.router.navigate(['/adminUsers/' + _id]);
              }
            });
          }
        });
      }
    }
  }

  onChange(event) {
    this.data = {
      value : event
    }

  }
}
