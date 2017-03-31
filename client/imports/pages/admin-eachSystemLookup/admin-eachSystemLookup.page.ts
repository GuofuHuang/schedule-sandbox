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
  name: string;
  collection: string;
  label: string;
  searchable: boolean;
  default: boolean;

  dataObj: {}

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.lookupID = params['lookupID'];
     console.log(this.lookupID);
    });

    MeteorObservable.call('returnLookup', this.lookupID).subscribe(lookupInfo => {
      console.log(lookupInfo);
      if (lookupInfo !== undefined) {
        this.name = lookupInfo["name"]
        this.collection = lookupInfo["collection"]
        this.label = lookupInfo["label"]
        this.searchable = lookupInfo["searchable"];
        this.default = lookupInfo["default"];
      }
    })

  }

  deleteLookup(event) {
    console.log("deleted")
    console.log(Meteor.userId())
    MeteorObservable.call('returnUser', Meteor.userId()).subscribe(userInfo => {
      console.log(userInfo)
    })
    // MeteorObservable.call('deleteSystemLookups', this.lookupID).subscribe(deleteLookup => {})
  }
}
