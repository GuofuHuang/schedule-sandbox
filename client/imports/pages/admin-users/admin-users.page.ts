import { Component, OnInit, Input, EventEmitter} from '@angular/core';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';

import template from './admin-users.page.html';
import style from './admin-users.page.scss';

@Component({
  selector: 'admin-users',
  template,
  styles: [ style ]
})

export class adminUsersPage implements OnInit{

  @Input() data: any;
  userCollections: any[];
  userLookupName: string;

  constructor() {}

  ngOnInit() {

    this.userCollections = [Users];
    this.userLookupName = 'users';



  }
}
