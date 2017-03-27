import { Component, OnInit } from '@angular/core';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';
import { CustomerMeetings } from '../../../../both/collections/customerMeetings.collection';

import template from './customer-meetings.component.html';

@Component({
  selector: 'customer-meetings',
  template
})

export class CustomerMeetingsComponent implements OnInit{
  customerCollections: any[];
  categoryCollections: any[];
  userCollections: any[];
  userCollection: any;
  customerLookupName: string;
  categoryLookupName: string;
  userLookupName: string;

  collections: any[];
  collection: any;
  fromCollection: any;
  updateCollection: any;
  updatedDocumentId: string;
  lookupName: string;

  constructor() {}

  ngOnInit() {
    // this.customerCollections = [Customers];
    // this.customerLookupName = 'customers';
    // this.categoryCollections = [Categories];
    // this.categoryLookupName = 'categories';
    this.userCollections = [Users];
    this.userCollection = Users;
    this.lookupName = 'updateUserManages';
    this.fromCollection = Users;
    this.updateCollection = Users;
    this.updatedDocumentId = '64gEseGzacxnnsee8';

    // this.collections = [CustomerMeetings, Customers, Users];
    // this.lookupName = 'customerMeetings';

  }
}