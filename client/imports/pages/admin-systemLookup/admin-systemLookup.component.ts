import { Component, OnInit, Input } from '@angular/core';
import { SystemLookups } from '../../../../both/collections/index';
import { Users } from '../../../../both/collections/users.collection';

// import { Customers } from '../../../../both/collections/customers.collection';

import template from './admin-systemLookup.component.html';
import style from './admin-systemLookup.component.scss';

@Component({
  selector: 'admin-systemLookup',
  template,
  styles: [ style ]
})

export class systemLookupComponent implements OnInit{

  @Input() data: any;
  systemLookupCollections: any[];
  systemLookupLookupName: string;

  // customerCollections: any[];
  // customerLookupName: string;


  constructor() {}

  ngOnInit() {
    // this.customerCollections = [Customers];
    // this.customerLookupName = 'customers';

    this.systemLookupCollections = [SystemLookups];
    this.systemLookupLookupName = 'systemLookup';



  }
}
