import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {MdDialog, MdDialogRef} from '@angular/material';

import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

import template from './admin-permissions.page.html';
import style from './admin-permissions.page.scss';
import { Router } from '@angular/router';

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
  permissionArray: any;
  permissionNameArray: any[];

  nameExistError: boolean = false;


  constructor(public dialog: MdDialog, private router: Router) {}

  ngOnInit() {

    this.permissionsCollections = [UserPermissions];
    this.permissionsLookupName = 'permissions';

    this.permissionNameArray = []

    MeteorObservable.call('getAllPermissions', this.dataObj).subscribe(permissionInfo => {
      console.log(permissionInfo)
      this.permissionArray = permissionInfo
      for (let i = 0; i < this.permissionArray.length; i++) {
          this.permissionNameArray.push(this.permissionArray[i].name)
      }
    })


  }

  nameExist(){
    this.nameExistError = _.contains(this.permissionNameArray, this.permissionNameInput) ? true : false;
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

    MeteorObservable.call('addPermission', this.dataObj).subscribe(permissionInfo => {
      console.log("added", this.dataObj)
    })

    let permissionName = "permissions." + permissionNameInput
    MeteorObservable.call('adminAddGroupsPermissions', permissionName).subscribe(updateInfo => {})
  }

  returnResult(event) {
    // console.log(event._id);
    this.router.navigate(['/adminPermissions/' + event._id]);
   }
}
