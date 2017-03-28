import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import template from './guofu-testing.page.html';
import { Users } from '../../../../both/collections/users.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

@Component({
  selector: 'guofu-testing',
  template
})

export class GuofuTestingPage implements OnInit{
  fromCollection: any; // collection that is used to retrieve the data
  updateCollection: any; // collection that is used to update
  updatedDocumentId: string; // document Id that will be updated
  lookupName: string; // system lookup name

  fromCollection1: any; // collection that is used to retrieve the data
  updateCollection1: any; // collection that is used to update
  updatedDocumentId1: string; // document Id that will be updated
  lookupName1: string; // system lookup name

  fromCollection2: any; // collection that is used to retrieve the data
  updateCollection2: any; // collection that is used to update
  updatedDocumentId2: string; // document Id that will be updated
  lookupName2: string; // system lookup name

  constructor(private router: Router) {}

  ngOnInit() {
    this.lookupName = 'updateUserManages';
    this.fromCollection = Users;
    this.updateCollection = Users;
    this.updatedDocumentId = "64gEseGzacxnnsee8";

    this.lookupName1 = 'updateUserGroups';
    this.fromCollection1 = UserGroups;
    this.updateCollection1 = Users;
    this.updatedDocumentId1 = "64gEseGzacxnnsee8";

    this.lookupName2 = 'updateGroupPermissions';
    this.fromCollection2 = UserPermissions;
    this.updateCollection2 = UserGroups;
    this.updatedDocumentId2 = "wmQgkMnOYymQKH5fl";

    console.log(this.router);

  }

}
