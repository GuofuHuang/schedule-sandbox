import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';
import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import { Meteor } from 'meteor/meteor';

import * as _ from "underscore";
import template from './admin-eachPermission.page.html';
import style from './admin-eachPermission.page.scss';

import { Router } from '@angular/router';

@Component({
  selector: 'admin-eachPermission',
  template,
  styles: [ style ]
})

export class adminEachPermissionPage implements OnInit{

  @Input() data: any;
  permissionID: string;
  name: string;
  description: string;
  url: string;
  nameInput: string;
  descriptionInput: string;
  urlInput: string;

  URLArray: any;
  permissionURLArray: any[];
  URLExistError: boolean = false;

  dataObj: {}

  constructor(private route: ActivatedRoute,  private router: Router, private _service: NotificationsService) {}

  ngOnInit() {

    this.permissionURLArray = []

    this.route.params.subscribe((params: Params) => {
     this.permissionID = params['permissionID'];
    });

    MeteorObservable.call('returnPermission', this.permissionID).subscribe(permissionInfo => {
      if (permissionInfo !== undefined) {
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
  }

  onBlurMethod(){
    let nameInput = this.nameInput
    let descriptionInput = this.descriptionInput
    let urlInput = this.urlInput

    if ((nameInput !== "" && descriptionInput !== "" && urlInput !== "") &&
      (nameInput !== this.name || descriptionInput !== this.description || urlInput !== this.url)) {
      this.dataObj = {
        id: this.permissionID,
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
      MeteorObservable.call('returnPermission', this.permissionID).subscribe(permissionInfo => {
        this.name = permissionInfo["name"]
        this.description = permissionInfo["description"]
        this.url = permissionInfo["url"]
      })
    }
  }

  removePemission (){
    let permissionName = this.nameInput

    MeteorObservable.call('softDeleteDocument', "userPermissions", this.permissionID).subscribe(updateInfo => {})
    // MeteorObservable.call('adminRemovePermissions', this.permissionID).subscribe(updateInfo => {})
    MeteorObservable.call('adminRemoveGroupsPermissions', permissionName).subscribe(updateInfo => {})

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
  }
}
