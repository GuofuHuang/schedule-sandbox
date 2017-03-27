import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {MdDialog, MdDialogRef} from '@angular/material';

import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

import template from './admin-permissions.page.html';
import style from './admin-permissions.page.scss';

@Component({
  selector: 'admin-permissions',
  template,
  styles: [ style ]
})

export class adminPermissionsPage implements OnInit{

  @Input() data: any;
  dataObj: {}
  permissionsCollections: any[];
  permissionsLookupName: string;
  permissionNameInput: string;
  permissionDescriptionInput: string;
  permissionUrlInput: string;

  constructor(public dialog: MdDialog) {}

  ngOnInit() {

    this.permissionsCollections = [UserPermissions];
    this.permissionsLookupName = 'permissions';


  }
  addPemission() {
    console.log(Session.get('tenantId'))

    let permissionNameInput = this.permissionNameInput;
    // console.log(permissionNameInput)
    let permissionDescriptionInput = this.permissionDescriptionInput
    // console.log(permissionDescriptionInput)
    let permissionUrlInput = this.permissionUrlInput
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
