import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachSystemLookup.page.html';
import style from './admin-eachSystemLookup.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-eachSystemLookup',
  template,
  styles: [ style ]
})

export class eachSystemLookupPage implements OnInit{



  @Input() data: any;
  lookupID: string;

  name: string;
  subscriptions: string;
  methods: string;
  dataTable: string;
  default: boolean = false;
  developer: boolean = false;

  nameInput: string;
  collectionInput: string;
  labelInput: string;
  searchable: boolean;
  subscriptionsInput: string;
  methodsInput: string;
  dataTableInput: string;

  dataObj: {}
  inputObj: {}

  validJsonErrorSubs: boolean = true;
  validJsonErrorMethods: boolean = true;
  validJsonErrorDataTable: boolean = true;

  editLookupForm: any;

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.lookupID = params['lookupID'];
    //  console.log(this.lookupID);
    });

    MeteorObservable.call('returnLookup', this.lookupID).subscribe(lookupInfo => {
      if (lookupInfo !== undefined) {
        this.nameInput = lookupInfo["name"];
        this.labelInput = lookupInfo["label"];
        this.searchable = lookupInfo["searchable"];
        this.subscriptions = lookupInfo["subscriptions"];
        this.methods = lookupInfo["methods"];
        this.dataTable = lookupInfo["dataTable"];

        this.name = this.nameInput;
      }
      MeteorObservable.call('userHasPermission', "developerPermission").subscribe(permission => {
        let developer = (permission === "enabled") ? true : false;
        this.developer = developer
      })

      this.subscriptionsInput = JSON.stringify(this.subscriptions, undefined, 4)
      this.methodsInput = JSON.stringify(this.methods, undefined, 4)
      this.dataTableInput = JSON.stringify(this.dataTable, undefined, 4)
    })



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


  onBlurMethod(){
    if (this.validJsonErrorSubs && this.validJsonErrorMethods && this.validJsonErrorDataTable) {
      let subscriptions = JSON.parse(this.subscriptionsInput)
      let methods = JSON.parse(this.methodsInput)
      let dataTable = JSON.parse(this.dataTableInput)
      let inputArr = []
      let count = 0

      this.inputObj = {
        name: this.nameInput,
        // collection: this.collectionInput,
        label: this.labelInput,
        searchable: this.searchable,
        subscriptions: subscriptions,
        methods: methods,
        dataTable: dataTable
      }

      for(var key in this.inputObj) {
        var value = this.inputObj[key];
        if (value !== undefined && value !== "") {
          inputArr.push(value)
        }
        count++
      }

      this.name = this.nameInput
      
      if (inputArr.length === count) {
        // console.log(this.inputObj)
        console.log("updated")
        MeteorObservable.call('updateDocument', 'systemLookups', this.lookupID, this.inputObj).subscribe(updateLookup => {})
      }
    }
  }

  deleteLookup(event) {
    console.log("deleted")
    MeteorObservable.call('deleteSystemLookups', this.lookupID).subscribe(deleteLookup => {})
    this.router.navigate(['/admin/lookup/']);
  }
}
