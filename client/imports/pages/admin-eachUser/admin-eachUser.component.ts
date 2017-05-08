import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { MdDialog, MdDialogRef } from '@angular/material';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachUser.component.html';
import style from './admin-eachUser.component.scss';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'admin-eachUser',
  template,
  styles: [ style ]
})

export class adminEachUserComponent implements OnInit{

  @Input() data: any;
  @Output() onSelected = new EventEmitter<string>();

  userID: string;
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
    // this.router.navigate(['']);

    //
    // this._service.success(
    //   "Password Updated",
    //   'Successfully update the password',
    //   {
    //     timeOut: 5000,
    //     showProgressBar: true,
    //     pauseOnHover: true,
    //     clickToClose: false,
    //     maxLength: 10
    //   }
    // );

    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.userID = params['userID'];
    });

    this.lookupManages = 'manageUserManages';
    this.updateDocumentIdManages = "ALSXa4bXHPzuGs5Xy";

    this.fromCollection = Users;
    this.updateCollection = Users;
    this.updateDocumentId = this.userID;
    this.lookupName = "updateUserTenants";

    this.fromCollectionGroups = UserGroups;
    this.updateCollectionGroups = Users;
    this.updatedDocumentIdGroups = this.userID;
    this.lookupNameGroups = "updateUserGroups";


    this.fromCollectionTenants = SystemTenants;
    this.updateCollectionTenants = Users;
    this.updatedDocumentIdTenants = this.userID;
    this.lookupNameTenants = "updateSystemTenants";


    MeteorObservable.call('returnUser', this.userID).subscribe(userInfo => {
      console.log(userInfo);
      // console.log(userInfo["emails"][0].address);
      if (userInfo !== undefined) {
        this.firstName = userInfo["profile"].firstName;
        this.lastName = userInfo["profile"].lastName;
        this.username = userInfo["username"];
        this.emailAddress = userInfo["emails"][0].address;

        this.fullName = this.firstName + " " + this.lastName
      }
    })

  }

  removeUser() {
    let query = {
      _id: this.userID
    };
    let update = {
      $set: {
        removed: true
      }
    };
    MeteorObservable.call('update', 'users', query, update).subscribe(res => {
      console.log(res);
      console.log('remove');
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

    MeteorObservable.call('setPassword', this.userID, this.user.newPassword).subscribe(res => {
    });
  }

  addTenant() {
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.lookupName = 'addTenant';

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        let query = {
          _id: this.userID
        }
        MeteorObservable.call('findOne', 'users', query, {}).subscribe((res:any) => {
          console.log(res);
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
              console.log(res);
              this._service.success('Success', 'Update Successfully');
            })
          }

        })
        // let query = {
        //   _id: this.userID,
        //   "tenants._id": result.
        // };
        // let update = {
        //   $addToSet: {
        //     "tenants.$.groups": result._id
        //   }
        // }
        // if (this.objLocal.selected.default !== true) {
        //   this.runMethods(this.methods, selectedMethod);
        // } else {
        //   this._service.alert(
        //     'Failed',
        //     'You can not delete',
        //     {}
        //   )
        // }
      }
    });
  }

  onBlurMethod(){
    let firstNameInput;
    let lastNameInput;
    let username;
    let emailInput;

    if (this.firstNameInput == undefined) {
      firstNameInput = this.firstName
    } else {
      firstNameInput = this.firstNameInput;
    }
    if (this.lastNameInput == undefined) {
      lastNameInput = this.lastName
    } else {
      lastNameInput = this.lastNameInput;
    }
    if (this.usernameInput == undefined) {
      username = this.username
    } else {
      username = this.usernameInput;
    }
    if (this.emailInput == undefined) {
      emailInput = this.emailAddress
    } else {
      emailInput = this.emailInput;
    }

    if (firstNameInput.length > 0 && lastNameInput.length > 0 && username.length > 0 && emailInput.length > 0) {
      this.fullName = firstNameInput + " " + lastNameInput;
      this.dataObj = {
        id: this.userID,
        firstName: firstNameInput,
        lastName: lastNameInput,
        username: username,
        email: emailInput
      };
      console.log(this.dataObj);
      MeteorObservable.call('adminUpdateUser', this.dataObj).subscribe(userInfo => {})
    } else {
      console.log("empty fields");
    }
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