import { Component, OnInit, Input } from '@angular/core';
import { SystemLookups } from '../../../../both/collections/index';
import { Users } from '../../../../both/collections/users.collection';

import {MeteorObservable} from "meteor-rxjs";

import template from './admin-systemLookup.component.html';
import style from './admin-systemLookup.component.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-systemLookup',
  template,
  styles: [ style ]
})

export class systemLookupComponent implements OnInit{

  @Input() data: any;
  systemLookupCollections: any[];
  systemLookupLookupName: string;

  lookups = [
    {value: 'single', viewValue: 'Single'},
    {value: 'multi', viewValue: 'Multi'},
    {value: 'fieldUpdate', viewValue: 'Field Update'}
  ];

  dataObj: {}

  nameInput: string;
  collectionInput: string;
  labelInput: string;
  searchable: boolean;
  queryInput: string;
  dataTableInput: string;
  lookupTypeInput: string;


  constructor(private router: Router) {}

  ngOnInit() {
    this.systemLookupCollections = [SystemLookups];
    this.systemLookupLookupName = 'adminsystemLookup';

  }


  addLookup() {
    let searchable = false
    let findOptionsObj = {}
    let sortObj = {}

    if (this.searchable === true) {
      searchable = true
    }

    let query = JSON.parse(this.queryInput)
    let dataTable = JSON.parse(this.dataTableInput)

    this.dataObj = {
      name: this.nameInput,
      collection: this.collectionInput,
      label: this.labelInput,
      lookupType: this.lookupTypeInput,
      searchable: searchable,
      query,
      dataTable,
      tenantId : Session.get('tenantId'),
      updatedUserId : "",
      createdUserId : Meteor.userId(),
      updatedAt : new Date(),
      createdAt : new Date()
    }
    console.log(this.dataObj)
    MeteorObservable.call('insertDocument', "systemLookups", this.dataObj).subscribe(lookupInfo => {})
    this.router.navigate(['/adminLookup/'])
  }

  returnResult(event) {
    this.router.navigate(['/adminLookup/' + event._id]);
  }
}
