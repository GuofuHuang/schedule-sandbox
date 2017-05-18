import { Component, OnInit, Input } from '@angular/core';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "underscore";
import { Session } from 'meteor/session';
import {MdDialog, MdDialogRef} from '@angular/material';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './admin-groups.page.html';
import style from './admin-groups.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-groups',
  template,
  styles: [ style ]
})

export class AdminGroupsComponent implements OnInit{

  @Input()
  nameInput: string;
  groupExistError: boolean = false;
  permissionArray: any;
  permissionNameArray: any[];
  groupArray: any;
  groupNameArray: any[];
  dataObj: {};
  updateDocumentId: string;

  hideTable: boolean = false;
  hideAddForm: boolean = true;

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };

  constructor(private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {

    this.groupNameArray = [];
    this.permissionNameArray = [];

    MeteorObservable.call('returnUserGroups').subscribe(groupInfo => {
      this.groupArray = groupInfo
      for (let i = 0; i < this.groupArray.length; i++) {
          this.groupNameArray.push(this.groupArray[i].name)
      }
    })

    // MeteorObservable.call('getAllPermissions', this.dataObj).subscribe(permissionInfo => {
    //   this.permissionArray = permissionInfo
    //   for (let i = 0; i < this.permissionArray.length; i++) {
    //     if (this.permissionArray[i].deleted !== true) {
    //       this.permissionNameArray.push({"name": this.permissionArray[i].name, "value": "disabled"})
    //     }
    //   }
    // })

    MeteorObservable.autorun().subscribe(() => {
      if (Session.get('parentTenantId')) {
        MeteorObservable.call('getTenantPermissions', Session.get('parentTenantId')).subscribe((res:any =[]) => {
          res.forEach(permission => {
            this.permissionNameArray.push({"name": permission.name, "value": "disabled"});
          })
        });
      }
    })
  }

  groupExist(){
    this.groupExistError = _.contains(this.groupNameArray, this.nameInput) ? true : false;
  }

  returnResult(event) {
    this.updateDocumentId = event._id;
    console.log(this.updateDocumentId);
    this.router.navigate(['/admin/groups/' + event._id]);
  }

  addButton(event) {
    this.hideAddForm = false
    this.hideTable = true
  }

  openDialog() {
    if (this.hideTable === false) {
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

    this.hideAddForm = true
    this.hideTable = false
  }

  addGroup (){
    this.dataObj = {
      parentTenantId: Session.get('parentTenantId'),
      name: this.nameInput,
      groupPermissions: this.permissionNameArray
    }

    this._service.success(
      "Group Added",
      this.nameInput,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )

    MeteorObservable.call('addGroup', this.dataObj).subscribe(groupInfo => {
      this.router.navigate(['/admin/groups/' + groupInfo])
    })
  }
}
