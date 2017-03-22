import { Component, OnInit, Input } from '@angular/core';
import { SystemLookups } from '../../../../both/collections/index';
import { Users } from '../../../../both/collections/users.collection';

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

  constructor() {}

  ngOnInit() {

    this.systemLookupCollections = [SystemLookups];
    this.systemLookupLookupName = 'systemLookup';



  }
}
