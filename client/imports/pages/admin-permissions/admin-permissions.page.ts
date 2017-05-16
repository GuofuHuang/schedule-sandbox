import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {MdDialog, MdDialogRef} from '@angular/material';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';
import { Session } from 'meteor/session';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

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

  @Input()
  dataObj: {}
  permissionNameInput: string;
  permissionDescriptionInput: string;
  permissionUrlInput: string;
  moduleInput: string;
  permissionArray: any;
  URLArray: any;
  permissionNameArray: any[];
  permissionURLArray: any[];

  moduleError: boolean = true;
  nameExistError: boolean = false;
  URLExistError: boolean = false;
  valid: boolean = false;

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };

  modules = [
  ];

  constructor(public dialog: MdDialog, private router: Router, private _service: NotificationsService) {}

  ngOnInit() {

    this.permissionNameArray = []
    this.permissionURLArray = []

    MeteorObservable.call('find', 'systemTenants', {_id: Session.get('parentTenantId')}).subscribe(info => {
      console.log(info)
      console.log(info[0]["modules"])
      let moduleArray = info[0]["modules"]
      for (let i = 0; i < moduleArray.length; i++) {
        MeteorObservable.call('find', 'systemModules', {_id: moduleArray[i]}).subscribe(info => {
          let moduleName = info[0]["name"]
          this.modules.push({viewValue: moduleArray[i], moduleName: moduleName})
        })
      }
    })


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

  moduleSelection(){
    this.moduleError = false;
  }

  nameExist(){
    this.nameExistError = _.contains(this.permissionNameArray, this.permissionNameInput) ? true : false;
  }

  urlExist(){
    this.URLExistError = _.contains(this.permissionURLArray, this.permissionUrlInput) ? true : false;

    if (!this.URLExistError) {
        this.valid = true;
    }

    if (this.permissionUrlInput === "") {
        this.valid = false
    }
  }

  urlInputBlur(){
    if (this.permissionUrlInput === "") {
        this.valid = false
    }
  }

  addPemission() {
    console.log(Session.get('tenantId'))

    let permissionNameInput = this.permissionNameInput;
    // console.log(permissionNameInput)
    let permissionDescriptionInput = this.permissionDescriptionInput
    // console.log(permissionDescriptionInput)
    let permissionUrlInput = this.permissionUrlInput
    // console.log(permissionUrlInput)
    let moduleInput = this.moduleInput
    console.log(moduleInput)
    this.dataObj = {
      tenantId: Session.get('tenantId'),
      name: permissionNameInput,
      description: permissionDescriptionInput,
      url: permissionUrlInput,
      module: this.moduleInput
    }

    MeteorObservable.call('addPermission', this.dataObj).subscribe(permissionInfo => {
      console.log("added", this.dataObj)
    })

    // MeteorObservable.call('addPermissionToModule', this.dataObj).subscribe(permissionInfo => {
    //   console.log("added", this.dataObj)
    // })

    let permissionName = permissionNameInput
    MeteorObservable.call('adminAddGroupsPermissions', permissionName).subscribe(updateInfo => {})

    this._service.success(
      "Permission Added",
      permissionName,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )
  }

  openDialog() {
  let dialogRef = this.dialog.open(filterDialogComponent);
      dialogRef.afterClosed().subscribe(event => {
        console.log(event)
        let result = true;
        if (event === true) {
          result = false;
        }
        this.data = {
          value : event,
          hidden: result
        }
      });
    }

  returnResult(event) {
    console.log(event._id);
    this.router.navigate(['/admin/permissions/' + event._id]);
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
