import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {MdDialog, MdDialogRef} from '@angular/material';

import template from './admin-permissions.page.html';
import style from './admin-permissions.page.scss';

@Component({
  selector: 'admin-permissions',
  template,
  styles: [ style ]
})

export class adminPermissionsPage implements OnInit{

  @Input() data: any;
  // userCollections: any[];
  // userLookupName: string;
  dataObj: {}

  constructor(public dialog: MdDialog) {}

  ngOnInit() {

    // this.userCollections = [Users];
    // this.userLookupName = 'users';


  }
  addPemission() {
  console.log(generateMongoID())

  let permissionNameInput = (<HTMLInputElement>document.getElementById("permissionNameInput")).value;
  // console.log(firstNameInput)
  let permissionDescriptionInput = (<HTMLInputElement>document.getElementById("permissionDescriptionInput")).value;
  // console.log(lastNameInput)
  let permissionUrlInput = (<HTMLInputElement>document.getElementById("permissionUrlInput")).value;
  // console.log(lastNameInput)

  this.dataObj = {
    id: generateMongoID(),
    name: permissionNameInput,
    description: permissionDescriptionInput,
    url: permissionUrlInput,
    createdId: Meteor.userId(),
    createdDate: new Date()
  }
  console.log(this.dataObj)
  MeteorObservable.call('addPermission', this.dataObj).subscribe(permissionInfo => {})
  }
}

function generateMongoID () {
  var mongoID = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 17; i++ ) {
    mongoID += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return mongoID;
}
