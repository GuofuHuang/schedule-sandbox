import { Component, OnInit, Input, EventEmitter} from '@angular/core';
import { Categories } from "../../../../both/collections/categories.collection";
import { Customers } from '../../../../both/collections/customers.collection';
import { Users } from '../../../../both/collections/users.collection';

import template from './admin-users.page.html';
import style from './admin-users.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-users',
  template,
  styles: [ style ]
})

export class adminUsersPage implements OnInit{

  @Input() data: any;
  userCollections: any[];
  userLookupName: string;

  constructor(private router: Router) {}

  ngOnInit() {

    this.userCollections = [Users];
    this.userLookupName = 'users';



  }

  returnResult(event) {
    // console.log(event._id);
    this.router.navigate(['/adminUsers/' + event._id]);
  }
}
