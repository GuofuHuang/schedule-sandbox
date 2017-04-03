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

  dataObj: {}

  nameInput: string;
  collectionInput: string;
  labelInput: string;
  searchable: boolean;
  returnInput: string;
  findInput: string;
  sortInput: string;
  columnInput: string;

  number: number;
  numebrOfFields: number;

  rowData = []


  constructor(private router: Router) {}

  ngOnInit() {
    this.systemLookupCollections = [SystemLookups];
    this.systemLookupLookupName = 'adminsystemLookup';

    this.rowData = ["1", "2"]


  }

  addRow() {
    this.rowData.push("3")
  }

  onBlurMethod(){
    console.log(this.numebrOfFields)
    this.number = this.numebrOfFields
  }

  addLookup() {

    let findOptions = this.findInput.replace(/\s/g,'').split(',')
    let returnArray = this.returnInput.replace(/\s/g,'').split(',')
    let searchable = false
    let findOptionsObj = {}
    let sortObj = {}

    findOptions.map(fields => {
      findOptionsObj[fields] = 1
    })
    console.log(findOptionsObj)

    sortObj[this.sortInput] = 1

    if (this.searchable === true) {
      searchable = true
    }

    this.dataObj = {
      name: this.nameInput,
      collection: this.collectionInput,
      label: this.labelInput,
      searchable: searchable,
      return: returnArray,
      findOptions: findOptionsObj,
      sort: sortObj
    }
    console.log(this.columnInput.replace(/\s/g,'').split(','))
    // MeteorObservable.call('adminAddLookup', this.dataObj).subscribe(lookupInfo => {})
  }

  returnResult(event) {
    // console.log(event);
    // console.log(event._id);
    this.router.navigate(['/adminLookup/' + event._id]);
  }
}
