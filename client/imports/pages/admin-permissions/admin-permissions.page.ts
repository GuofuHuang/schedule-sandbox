import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {MdDialog, MdDialogRef} from '@angular/material';

import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

import * as _ from "underscore";
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
  URLArray: any;
  permissionNameArray: any[];
  permissionURLArray: any[];

  nameExistError: boolean = false;
  URLExistError: boolean = false;


  constructor(public dialog: MdDialog, private router: Router) {}

  ngOnInit() {

    this.permissionsCollections = [UserPermissions];
    this.permissionsLookupName = 'userPermissions';

    this.permissionNameArray = []
    this.permissionURLArray = []

    MeteorObservable.call('getAllPermissions').subscribe(permissionInfo => {
      // console.log(permissionInfo)
      this.permissionArray = permissionInfo
      for (let i = 0; i < this.permissionArray.length; i++) {
          this.permissionNameArray.push(this.permissionArray[i].name)
      }
    })

    MeteorObservable.call('getAllPermissionsUrl').subscribe(permissionInfo => {
      console.log(permissionInfo)
      this.URLArray = permissionInfo
      for(var key in this.URLArray) {
        var value = this.URLArray[key];
        if (value !== "") {
          this.permissionURLArray.push(value)
        }
      }
    })


  }

  nameExist(){
    this.nameExistError = _.contains(this.permissionNameArray, this.permissionNameInput) ? true : false;
  }

  urlExist(){
    this.URLExistError = _.contains(this.permissionURLArray, this.permissionUrlInput) ? true : false;
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
    console.log(event._id);
    this.router.navigate(['/adminPermissions/' + event._id]);
   }
}
