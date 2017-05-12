import { Component, OnInit, Input } from '@angular/core';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "underscore";
import { Session } from 'meteor/session';

import template from './admin-groups.page.html';
import style from './admin-groups.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-groups',
  template,
  styles: [ style ]
})

export class AdminGroupsComponent implements OnInit{

  @Input() data: any;
  nameInput: string;
  groupExistError: boolean = false;
  permissionArray: any;
  permissionNameArray: any[];
  groupArray: any;
  groupNameArray: any[];
  dataObj: {};
  updateDocumentId: string;

  constructor(private router: Router) {}

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
          console.log(res);
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
    this.router.navigate(['/admin/groups/' + event._id]);
  }

  addGroup (){
    this.dataObj = {
      parentTenantId: Session.get('parentTenantId'),
      name: this.nameInput,
      groupPermissions: this.permissionNameArray
    }

    MeteorObservable.call('addGroup', this.dataObj).subscribe(groupInfo => {
      this.router.navigate(['/admin/groups/' + groupInfo])
    })
  }
}
