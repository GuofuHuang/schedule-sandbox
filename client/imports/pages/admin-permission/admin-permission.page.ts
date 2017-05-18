import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {NotificationsService } from 'angular2-notifications';
import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import { Meteor } from 'meteor/meteor';
import { MdDialog, MdDialogRef } from '@angular/material';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

import {permissionModuleDialog} from '../../components/permissionModuleDialog/permissionModuleDialog.component';

import * as _ from "underscore";
import template from './admin-permission.page.html';
import style from './admin-permission.page.scss';
import { DialogSelect } from '../../components/system-query/system-query.component';

import { Router } from '@angular/router';

@Component({
  selector: 'admin-permission',
  template,
  styles: [ style ]
})

export class AdminPermissionPage implements OnInit{

  updateDocumentId: string;
  permissionId: string;
  name: string;
  description: string;
  url: string;
  nameInput: string;
  descriptionInput: string;
  urlInput: string;
  permission: any = {};

  URLArray: any;
  permissionURLArray: any[];
  URLExistError: boolean = false;

  dataObj: {}
  moduleNames: string;
  valid: boolean = true;

  constructor(private route: ActivatedRoute,  private router: Router, private dialog: MdDialog, private _service: NotificationsService) {}

  ngOnInit() {
    this.permissionURLArray = []
    this.moduleNames = ""

    this.route.params.subscribe((params: Params) => {
     this.permissionId = params['permissionID'];
     this.updateDocumentId = params['permissionID'];

     let query = {
       _id: this.permissionId
     };
     let options = {}
       MeteorObservable.autorun().subscribe(() => {
         UserPermissions.collection.find().fetch();
         MeteorObservable.call('find', 'userPermissions', query, options).subscribe(permissionInfo => {
           console.log(permissionInfo[0].modules)
           this.permission = permissionInfo[0].modules;

           for (let i = 0; i < this.permission.length; i++) {
             MeteorObservable.call('find', 'systemModules', {_id: this.permission[i]}).subscribe(info => {
               let moduleName = info[0]["name"]
               this.moduleNames += moduleName + ", "
             })
           }
         })

       })
    });
    this.moduleNames = this.moduleNames.replace(/,\s*$/, "")
    console.log(this.moduleNames)

    MeteorObservable.call('returnPermission', this.permissionId).subscribe(permissionInfo => {
      if (permissionInfo !== undefined) {
        console.log(permissionInfo)
        this.nameInput = permissionInfo["name"]
        this.descriptionInput = permissionInfo["description"]
        this.urlInput = permissionInfo["url"]

        this.name = this.nameInput
        this.description = this.descriptionInput
        this.url = this.urlInput
      } else {
        this.router.navigate(['/admin/permissions/'])
      }
    })

    MeteorObservable.call('getAllPermissionsUrl').subscribe(permissionInfo => {
      this.URLArray = permissionInfo

      for(var key in this.URLArray) {
        var value = this.URLArray[key];
        if (value !== "" && value !== this.urlInput) {
          this.permissionURLArray.push(value)
        }
      }
    })

  }

  urlExist(){
    this.URLExistError = _.contains(this.permissionURLArray, this.urlInput) ? true : false;

    this.valid = (!this.URLExistError) ? true : false;
  }

  onBlurMethod(){
    let nameInput = this.nameInput
    let descriptionInput = this.descriptionInput
    let urlInput = this.urlInput

    if (urlInput === "") {
        this.valid = false
    }

    if (!this.URLExistError) {
      if ((nameInput !== "" && descriptionInput !== "" && urlInput !== "") &&
      (nameInput !== this.name || descriptionInput !== this.description || urlInput !== this.url)) {
        this.dataObj = {
          id: this.permissionId,
          name: nameInput,
          description: descriptionInput,
          url: urlInput,
          updatedUserId: Meteor.userId(),
          updatedAt: new Date()
        }
        this._service.success(
          "Permission Updated",
          this.nameInput,
          {
            timeOut: 5000,
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false,
            maxLength: 10
          }
        )
        MeteorObservable.call('adminUpdatePermission', this.dataObj).subscribe(permissionInfo => {})
        MeteorObservable.call('returnPermission', this.permissionId).subscribe(permissionInfo => {
          this.name = permissionInfo["name"]
          this.description = permissionInfo["description"]
          this.url = permissionInfo["url"]
        })
      }
    }
  }

  removePermission(){
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let permissionName = this.nameInput
        MeteorObservable.call('softDeleteDocument', "userPermissions", this.permissionId).subscribe(updateInfo => {})
        // MeteorObservable.call('adminRemovePermissions', this.permissionID).subscribe(updateInfo => {})
        MeteorObservable.call('adminRemoveGroupsPermissions', permissionName).subscribe(updateInfo => {
          this._service.success(
            "Permission Removed",
            this.nameInput,
            {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            }
          )
          this.router.navigate(['/admin/permissions/']);
        });
      }
    });

  }

  openDialog() {
    let dialogRef = this.dialog.open(permissionModuleDialog)
    let instance = dialogRef.componentInstance;
    // console.log(instance)
    instance.text = this.updateDocumentId;
  }
}
