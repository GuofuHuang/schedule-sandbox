import { Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import {MdDialog} from '@angular/material';

import { Users } from '../../../../both/collections/users.collection';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './admin-users.page.html';
import style from './admin-users.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-users',
  template,
  styles: [ style ]
})

export class AdminUsersPage implements OnInit{

  userCollections: any[];
  userLookupName: string;
  newUser: FormGroup;
  email: string;
  readonly: boolean = true;

  hideTable: boolean = false;
  hideAddForm: boolean = true;

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };
  password: string;
  tenants: any = [];

  constructor(private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
    console.log(this.readonly);
    this.newUser = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });

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

  openDialog() {
    if (this.hideTable === false) {
      let dialogRef = this.dialog.open(filterDialogComponent);
      dialogRef.afterClosed().subscribe(event => {
        if (event) {
          let result = true;
          if (event === true) {
            result = false;
          }
          this.data = {
            value : event,
            hidden: result
          }
        }
      });
    }
    this.hideAddForm = true
    this.hideTable = false
  }

  addButton(event) {
    this.hideAddForm = false
    this.hideTable = true
  }

  onSelect(event) {
    this.router.navigate(['/admin/users/' + event._id]);
  }

  addUser(user) {
    let tenants = this.tenants.map(tenant => {
      let temp = {
        _id: tenant._id,
        enabled: false,
        groups: [""]
      };
      return temp;
    });

    if (user.valid) {
      let newUser = {
        username: user.value.email,
        email: user.value.email,
        profile: {
          firstName: user.value.firstName,
          lastName: user.value.lastName
        },
        password: user.value.password,
        parentTenantId: Session.get('parentTenantId')
      }

      MeteorObservable.call('addUser', newUser).subscribe((res:any) => {
        this._service[res.result](
          res.subject,
          res.message
        )
        if (res.result === 'success') {
          this.router.navigate(['/admin/users', res.userId]);
        }
      });
    }
  }

  removeReadonly() {
    this.readonly = false;
  }
}
