import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachPermission.page.html';
import style from './admin-eachPermission.page.scss';

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

  dataObj: {}

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.permissionID = params['permissionID'];
     console.log(this.permissionID);
    });

    MeteorObservable.call('returnPermission', this.permissionID).subscribe(permissionInfo => {
      console.log(permissionInfo);
      if (permissionInfo !== undefined) {
        this.name = permissionInfo["name"]
        this.description = permissionInfo["description"]
        this.url = permissionInfo["url"]
      }
    })

  }
  onBlurMethod(){
    let nameInput
    let descriptionInput
    let urlInput

    if (this.nameInput == undefined) {
      nameInput = this.name
    } else {
      nameInput = this.nameInput
    }
    if (this.descriptionInput == undefined) {
      descriptionInput = this.description
    } else {
      descriptionInput = this.descriptionInput
    }
    if (this.urlInput == undefined) {
      urlInput = this.url
    } else {
      urlInput = this.urlInput
    }

    this.dataObj = {
      id: this.permissionID,
      name: nameInput,
      description: descriptionInput,
      url: urlInput,
      updatedUserID: Meteor.userId(),
      updatedDate: new Date()
    }
    console.log(this.dataObj)
    MeteorObservable.call('adminUpdatePermission', this.dataObj).subscribe(userInfo => {})
  }

  removePemission (){
    let nameInput
    let permissionName = "permissions." + nameInput

    if (this.nameInput == undefined) {
      nameInput = this.name
    } else {
      nameInput = this.nameInput
    }
    MeteorObservable.call('softDeleteDocument', "userPermissions", this.permissionID).subscribe(updateInfo => {})
    // MeteorObservable.call('adminRemovePermissions', this.permissionID).subscribe(updateInfo => {})
    MeteorObservable.call('adminRemoveGroupsPermissions', permissionName).subscribe(updateInfo => {})
  }
}
