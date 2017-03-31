import { Component, OnInit } from '@angular/core';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';
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
  customerLookupName: string;
  categoryLookupName: string;
  userLookupName: string;

  collections: any[];
  collection: any;
  lookupName: string;

  constructor() {}

  ngOnInit() {
    this.customerCollections = [Customers];
    this.customerLookupName = 'customers';
    this.categoryCollections = [Categories];
    this.categoryLookupName = 'categories';
    this.userCollections = [Users];
    this.userLookupName = 'manageUsers';

    this.collections = [CustomerMeetings, Customers, Users];
    this.lookupName = 'customerMeetings';

  }
}