import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { MdDialog, MdDialogRef } from '@angular/material';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-user.component.html';
import style from './admin-user.component.scss';
import { DialogSelect } from '../../components/system-query/system-query.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'admin-user',
  template,
  styles: [ style ]
})

export class AdminUserComponent implements OnInit{

  @Input() data: any;
  @Output() onSelected = new EventEmitter<string>();

  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  firstNameInput: string;
  lastNameInput: string;
  usernameInput: string;
  emailInput: string;
  fullName: string;
  user: any = {};

  fromCollection: any;
  updateCollection: any;
  updateDocumentId: string;
  lookupName: string;

  fromCollectionGroups: any;
  updateCollectionGroups: any;
  updatedDocumentIdGroups: string;
  lookupNameGroups: string;

  lookupManages: string;
  updateDocumentIdManages: string;

  fromCollectionTenants: any;
  updateCollectionTenants: any;
  updatedDocumentIdTenants: string;
  lookupNameTenants: string;

  dataObj: {};

  public options = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'bottom']
  };

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MdDialog,  private _service: NotificationsService) {}

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
    });

    this.fromCollection = Users;
    this.updateCollection = Users;
    this.updateDocumentId = this.userId;
    this.lookupName = "updateUserTenants";

    this.fromCollectionGroups = UserGroups;
    this.updateCollectionGroups = Users;
    this.updatedDocumentIdGroups = this.userId;
    this.lookupNameGroups = "updateUserGroups";


    this.fromCollectionTenants = SystemTenants;
    this.updateCollectionTenants = Users;
    this.updatedDocumentIdTenants = this.userId;
    this.lookupNameTenants = "updateSystemTenants";

    console.log(this.userId);

    MeteorObservable.call('returnUser', this.userId).subscribe(userInfo => {
      console.log(userInfo);

      if (userInfo !== undefined) {
        console.log(userInfo);
        this.firstName = userInfo["profile"].firstName;
        this.lastName = userInfo["profile"].lastName;
        this.username = userInfo["username"];
        this.emailAddress = userInfo["emails"][0].address;

        this.fullName = this.firstName + " " + this.lastName
      }
    })
  }

  removeUser() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.userId
        };
        let update = {
          $set: {
            removed: true
          }
        };
        MeteorObservable.call('update', 'users', query, update).subscribe(res => {
          this._service.success(
            'Success',
            'Removed Successfully'
          );
          this.router.navigate(['/admin/users']);
        });

      }
    });
  }

  savePassword() {
    this._service.success(
      "Password Updated",
      'Successfully update the password',
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        maxLength: 10
      }
    );

    MeteorObservable.call('setPassword', this.userId, this.user.newPassword).subscribe(res => {
    });
  }

  addTenant() {
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.lookupName = 'addTenant';

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.userId
        }
        MeteorObservable.call('findOne', 'users', query, {}).subscribe((res:any) => {
          let tenants = res.tenants;
          let exist = false;
          tenants.some(tenant => {
            if (tenant._id === result._id) {
              exist = true;
              return true;
            }
          });
          if (exist) {
            this._service.error('Failed', 'already exist');
          } else {
            let update = {
              $addToSet: {
                tenants: {
                  _id: result._id,
                  enabled: true,
                  groups: [""]
                }
              }
            }

            MeteorObservable.call('update', 'users', query, update).subscribe(res => {
              this._service.success('Success', 'Update Successfully');
            })
          }

        })
      }
    });
  }

  onBlurMethod(target){
    let field = target.name;
    let value = target.value;
    let query = {
      _id: this.userId
    }
    let update = {
      $set: {
        [field]: value
      }
    };
    MeteorObservable.call('update', 'users', query, update).subscribe(res => {
      console.log(res);
    })
  }
}


@Component({
  selector: 'add-tenant',
  template: `<system-query [lookupName]="'addTenant'" [updateDocumentId]="updatedAt" (onSelected)="onSelect($event)"></system-query>`

  // template: `adfasdfasdf`
})

export class AddTenantComponent {
  constructor(public dialogRef: MdDialogRef<AddTenantComponent>) {}

  onSelect(event) {

    this.dialogRef.close();
  }
}