import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';
import {NotificationsService } from 'angular2-notifications';
import * as _ from "underscore";

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-group.page.html';
import style from './admin-group.page.scss';

@Component({
  selector: 'admin-group',
  template,
  styles: [ style ]
})

export class AdminGroupPage implements OnInit{

  @Input() data: any;
  groupId: string;
  nameInput: string;
  name: string;
  groupArray: any;
  groupNameArray: any[];
  groupExistError: boolean = false;

  fromCollection: any;
  updateCollection: any;
  updateDocumentId: string;
  lookupName: string;

  dataObj: {}

  public options = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'bottom']
  };

  constructor(private route: ActivatedRoute, private router: Router, private _service: NotificationsService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.groupId = params['groupId'];
     console.log('groupId', this.groupId);
    });

    this.groupNameArray = [];
    MeteorObservable.call('find', 'userGroups', {parentTenantId: Session.get('parentTenantId')}).subscribe(groupInfo => {
      this.groupArray = groupInfo

      for (let i = 0; i < this.groupArray.length; i++) {
          this.groupNameArray.push(this.groupArray[i].name)
      }
    })

    this.lookupName = 'manageGroupPermissions';
    this.fromCollection = UserPermissions;
    this.updateCollection = UserGroups;
    this.updateDocumentId =  this.groupId;

    MeteorObservable.call('findOne', 'userGroups', {_id: this.groupId}).subscribe(groupInfo => {
      this.nameInput = groupInfo["name"]

      this.name = this.nameInput
    })
  }

  groupExist(){
    this.groupExistError = _.contains(this.groupNameArray, this.nameInput) ? true : false;
  }

  save(){
    if (this.nameInput.length > 0 && this.groupExistError !== true) {
      this.dataObj = {
        id: this.groupId,
        name: this.nameInput
      }

      if (this.nameInput !== this.name) {
        this._service.success(
          "Group Updated",
          this.nameInput,
          {
            timeOut: 5000,
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false,
            maxLength: 10
          }
        );
        MeteorObservable.call('adminUpdateGroup', this.dataObj).subscribe(groupInfo => {})
        this.name = this.nameInput
      }
    }
  }

  removeGroup(){
    MeteorObservable.call('softDeleteDocument', "userGroups", this.groupId).subscribe(groupInfo => {})
    MeteorObservable.call('removeGroupFromUserCollection', this.groupId).subscribe(groupInfo => {})

    this._service.success(
      "Group Removed",
      this.nameInput,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )

    this.router.navigate(['/admin/groups/']);
  }
}
