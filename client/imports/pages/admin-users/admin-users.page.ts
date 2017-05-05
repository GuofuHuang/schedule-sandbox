import { Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';

import { Users } from '../../../../both/collections/users.collection';

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
  newUser: FormGroup;
  email: string;
  readonly: boolean = true;

  selections = [
    {
      value: {
        $in: [null, false]
      },
      label: 'active users'
    },
    {
      value: true,
      label: 'removed users'
    }
  ];

  dataObj: {};
  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };
  firstNameInput: string;
  lastNameInput: string;
  emailInput: string;
  password: string;
  groups = {};
  tenants: any = [];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log(this.readonly);
    this.newUser = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      newEmail: new FormControl(''),
      newPassword: new FormControl('')
    });
    // this.newUser.value.newEmail = '';
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
      password: this.password
    }
    console.log(this.newUser.value);
    // console.log(this.newUser.password.pristine);
      //
      // if (this.firstNameInput.length > 0 && this.lastNameInput.length > 0 && this.emailInput.length > 0 && this.passwordInput.length > 0) {
      //   MeteorObservable.call('addUser', this.dataObj).subscribe(_id => {
      //     if (_id) {
      //       let query = {
      //         _id: _id
      //       };
      //       let update = {
      //         $set:{
      //           manages: [],
      //           tenants: tenants,
      //           parentTenantId: Session.get('parentTenantId')
      //         }
      //       };
      //       let args = [query, update];
      //       MeteorObservable.call('update', 'users', ...args).subscribe((res) => {
      //         if (res) {
      //           this.router.navigate(['/adminUsers/' + _id]);
      //         }
      //       });
      //     }
      //   });
      // }
  }

  removeReadonly() {
    this.readonly = false;
  }

  onChange(event) {
    console.log(event);
    let result = true;
    if (event === true) {
      result = false;
    }
    this.data = {
      value : event,
      hidden: result
    }

  }
}
