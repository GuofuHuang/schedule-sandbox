import { Component, OnInit, Input } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

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
  updatedDocumentId: string;
  lookupName: string;

  dataObj: {}

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.groupID = params['groupID'];
     console.log(this.groupID);
    });

    this.lookupName = 'updateGroupPermissions';
    this.fromCollection = UserPermissions;
    this.updateCollection = UserGroups;
    this.updatedDocumentId =  this.groupID;

    MeteorObservable.call('returnGroup', this.groupID).subscribe(groupInfo => {
      console.log(groupInfo);
      this.name = groupInfo["name"]
    })
  }

  save(){
    let nameInput

    if (this.nameInput == undefined) {
      nameInput = this.name
    } else {
      nameInput = this.nameInput
    }
    console.log(nameInput)
    this.name = nameInput

    this.dataObj = {
      id: this.groupID,
      name: nameInput
    }
    MeteorObservable.call('adminUpdateGroup', this.dataObj).subscribe(groupInfo => {})
  }

  removeGroup(){
    MeteorObservable.call('removeGroup', this.groupID).subscribe(groupInfo => {})
    MeteorObservable.call('removeGroupFromUserCollection', this.groupID).subscribe(groupInfo => {})
    this.router.navigate(['/adminGroups/']);
  }
}
