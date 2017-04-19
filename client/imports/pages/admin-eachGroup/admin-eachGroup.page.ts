import { Component, OnInit, Input } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachGroup.page.html';
import style from './admin-eachGroup.page.scss';

@Component({
  selector: 'admin-eachGroup',
  template,
  styles: [ style ]
})

export class adminEachGroupPage implements OnInit{

  @Input() data: any;
  groupID: string;
  nameInput: string;
  name: string;

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
     this.groupID = params['groupID'];
    });

    this.lookupName = 'manageGroupPermissions';
    this.fromCollection = UserPermissions;
    this.updateCollection = UserGroups;
    this.updateDocumentId =  this.groupID;

    MeteorObservable.call('returnGroup', this.groupID).subscribe(groupInfo => {
      console.log(groupInfo);
      this.nameInput = groupInfo["name"]

      this.name = this.nameInput
    })
  }

  save(){
    if (this.nameInput.length > 0) {
      this.dataObj = {
        id: this.groupID,
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
        )
        MeteorObservable.call('adminUpdateGroup', this.dataObj).subscribe(groupInfo => {})
        this.name = this.nameInput
      }
    }
  }

  removeGroup(){
    MeteorObservable.call('softDeleteDocument', "userGroups", this.groupID).subscribe(groupInfo => {})
    // MeteorObservable.call('removeGroup', this.groupID).subscribe(groupInfo => {})
    MeteorObservable.call('removeGroupFromUserCollection', this.groupID).subscribe(groupInfo => {})
    this.router.navigate(['/admin/groups/']);
  }
}
