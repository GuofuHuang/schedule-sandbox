import { Component, OnInit, Input } from '@angular/core';
import { SystemLookups } from '../../../../both/collections/systemLookups.collection';
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

  validJsonErrorSubs: boolean = true;
  validJsonErrorMethods: boolean = true;
  validJsonErrorDataTable: boolean = true;

  nameInput: string;
  // collectionInput: string;
  labelInput: string;
  searchable: boolean;
  subscriptionsInput: string;
  methodsInput: string;
  dataTableInput: string;
  lookupTypeInput: string;


  constructor(private router: Router) {}

  ngOnInit() {
    this.systemLookupCollections = [SystemLookups];
    this.systemLookupLookupName = 'adminsystemLookup';

  }

  validJsonSubs(){
    try {
        JSON.parse(this.subscriptionsInput);
    } catch (e) {
        return this.validJsonErrorSubs = false;
    }
    return this.validJsonErrorSubs = true;
  }
  validJsonMethods(){
    try {
        JSON.parse(this.methodsInput);
    } catch (e) {
        return this.validJsonErrorMethods = false;
    }
    return this.validJsonErrorMethods = true;
  }
  validJsonDataTable(){
    try {
        JSON.parse(this.dataTableInput);
    } catch (e) {
        return this.validJsonErrorDataTable = false;
    }
    return this.validJsonErrorDataTable = true;
  }

  addLookup() {
    let searchable = false
    let findOptionsObj = {}
    let sortObj = {}

    if (this.searchable === true) {
      searchable = true
    }

    let subscriptions = JSON.parse(this.subscriptionsInput)
    let methods = JSON.parse(this.methodsInput)
    let dataTable = JSON.parse(this.dataTableInput)

    this.dataObj = {
      name: this.nameInput,
      // collection: this.collectionInput,
      label: this.labelInput,
      lookupType: this.lookupTypeInput,
      searchable: searchable,
      subscriptions,
      methods,
      dataTable,
      tenantId : Session.get('tenantId'),
      updatedUserId : "",
      createdUserId : Meteor.userId(),
      updatedAt : new Date(),
      createdAt : new Date()
    }
    console.log(this.dataObj)
    MeteorObservable.call('insertDocument', "systemLookups", this.dataObj).subscribe(lookupInfo => {})
    this.router.navigate(['/admin/lookup/'])
  }

  returnResult(event) {
    this.router.navigate(['/admin/lookup/' + event._id]);
  }
}
