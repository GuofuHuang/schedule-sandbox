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

    // console.log("json",JSON.stringify(JSON.parse(this.queryInput), undefined, 4));
    let query = JSON.parse(this.queryInput)
    let dataTable = JSON.parse(this.dataTableInput)

    this.dataObj = {
      tenantId: Session.get('tenantId'),
      name: this.nameInput,
      collection: this.collectionInput,
      label: this.labelInput,
      lookupTypeInput: this.lookupTypeInput,
      searchable: searchable,
      findOptions: findOptionsObj,
      sort: sortObj,
      query: query,
      dataTable: dataTable
    }
    console.log(this.dataObj)
    // MeteorObservable.call('adminAddLookup', this.dataObj).subscribe(lookupInfo => {})
  }

  returnResult(event) {
    // console.log(event);
    // console.log(event._id);
    this.router.navigate(['/adminLookup/' + event._id]);
  }
}
