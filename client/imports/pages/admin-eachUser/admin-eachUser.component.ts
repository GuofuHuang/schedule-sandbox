import { Component, OnInit, Input } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachUser.component.html';
import style from './admin-eachUser.component.scss';

@Component({
  selector: 'admin-eachUser',
  template,
  styles: [ style ]
})

export class adminEachUserComponent implements OnInit{

  @Input() data: any;
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

  fromCollection: any;
  updateCollection: any;
  updateDocumentId: string;
  lookupName: string;

  fromCollectionGroups: any;
  updateCollectionGroups: any;
  updatedDocumentIdGroups: string;
  lookupNameGroups: string;

  fromCollectionTenants: any;
  updateCollectionTenants: any;
  updatedDocumentIdTenants: string;
  lookupNameTenants: string;

  dataObj: {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.userID = params['userID'];
      console.log(this.userID);
    });

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
