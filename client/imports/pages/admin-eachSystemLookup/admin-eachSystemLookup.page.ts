import { Component, OnInit, Input } from '@angular/core';
import { SystemLookups } from '../../../../both/collections/index';
import { ActivatedRoute, Params } from '@angular/router';


import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachSystemLookup.page.html';
import style from './admin-eachSystemLookup.page.scss';

@Component({
  selector: 'admin-eachSystemLookup',
  template,
  styles: [ style ]
})

export class eachSystemLookupPage implements OnInit{

  @Input() data: any;
  lookupID: string;

  lookup: string;
  query: string;
  dataTable: string;
  default: boolean = false;
  developer: boolean = false;

  nameInput: string;
  collectionInput: string;
  labelInput: string;
  searchable: boolean;
  queryInput: string;
  dataTableInput: string;

  dataObj: {}
  inputObj: {}

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.lookupID = params['lookupID'];
     console.log(this.lookupID);
    });

    MeteorObservable.call('returnLookup', this.lookupID).subscribe(lookupInfo => {
      console.log(lookupInfo);
      if (lookupInfo !== undefined) {
        this.nameInput = lookupInfo["name"]
        this.collectionInput = lookupInfo["collection"]
        this.labelInput = lookupInfo["label"]
        this.searchable = lookupInfo["searchable"];
        this.lookup = lookupInfo["lookupType"];
        this.query = lookupInfo["query"];
        this.dataTable = lookupInfo["dataTable"];
        this.default = lookupInfo["default"];
      }
      MeteorObservable.call('userHasPermission', "developerPermission").subscribe(permission => {
        let developer = (permission === "enabled") ? true : false;
        this.developer = developer
      })

      this.queryInput = JSON.stringify(this.query, undefined, 4)
      this.dataTableInput = JSON.stringify(this.dataTable, undefined, 4)
    })



  }

  onBlurMethod(){
    let query = JSON.parse(this.queryInput)
    let dataTable = JSON.parse(this.dataTableInput)

    this.inputObj = {
      name: this.nameInput,
      collection: this.collectionInput,
      label: this.labelInput,
      searchable: this.searchable,
      query: query,
      dataTable: dataTable
    }
    // console.log(this.inputObj)
    MeteorObservable.call('updateDocument', 'systemLookups', this.lookupID, this.inputObj).subscribe(updateLookup => {})
  }

  deleteLookup(event) {
    console.log("deleted")
    // console.log(Meteor.userId())
    // MeteorObservable.call('returnUser', Meteor.userId()).subscribe(userInfo => {
    //   console.log(userInfo)
    // })
    MeteorObservable.call('deleteSystemLookups', this.lookupID).subscribe(deleteLookup => {})
  }
}
