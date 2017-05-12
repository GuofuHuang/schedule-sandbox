import { Component, OnInit, Input } from '@angular/core';
import { SystemLookups } from '../../../../both/collections/systemLookups.collection';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';
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

  systemLookupCollections: any[];
  systemLookupLookupName: string;

  dataObj: {}
  selections = [
    {
      value: {
        $in: [null, false]
      },
      label: 'existed systemlookups'
    },
    {
      value: true,
      label: 'removed systemlookups'
    }
  ];
  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };

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


  constructor(private router: Router, private _service: NotificationsService) {}

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
      label: this.labelInput,
      searchable: searchable,
      subscriptions,
      methods,
      dataTable,
      tenantId : Session.get('tenantId'),
      parentTenantId : Session.get('parentTenantId'),
    }
    console.log(this.dataObj)
    MeteorObservable.call('insertDocument', "systemLookups", this.dataObj).subscribe(lookupInfo => {})

    this._service.success(
      "Lookup Added",
      this.nameInput,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )

    this.router.navigate(['/admin/lookup/'])
  }

  returnResult(event) {
    this.router.navigate(['/admin/lookup/' + event._id]);
  }

  onChange(event) {
    console.log(event);
    let result = true;
    if (event === true) {
      result = false;
    }
    this.data = {
      value : event,
      hidden: result
    }

  }

}
