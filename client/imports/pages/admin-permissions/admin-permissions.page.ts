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
    console.log(Session.get('tenantId'))

    let permissionNameInput = (<HTMLInputElement>document.getElementById("permissionNameInput")).value;
    // console.log(permissionNameInput)
    let permissionDescriptionInput = (<HTMLInputElement>document.getElementById("permissionDescriptionInput")).value;
    // console.log(permissionDescriptionInput)
    let permissionUrlInput = (<HTMLInputElement>document.getElementById("permissionUrlInput")).value;
    // console.log(permissionUrlInput)

    this.dataObj = {
      tenantId: Session.get('tenantId'),
      name: permissionNameInput,
      description: permissionDescriptionInput,
      url: permissionUrlInput,
    }
    if (permissionNameInput.length > 0 && permissionDescriptionInput.length > 0 && permissionUrlInput.length > 0) {
      MeteorObservable.call('addPermission', this.dataObj).subscribe(permissionInfo => {
        console.log("added", this.dataObj)
      })

      let permissionName = "permissions." + permissionNameInput
      MeteorObservable.call('adminAddGroupsPermissions', permissionName).subscribe(updateInfo => {})
    } else {
      console.log("blank fields")
    }
  }
}
