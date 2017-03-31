import { Component, OnInit, Input } from '@angular/core';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import {MeteorObservable} from "meteor-rxjs";

import template from './admin-groups.page.html';
import style from './admin-groups.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-groups',
  template,
  styles: [ style ]
})

export class AdminGroupsComponent implements OnInit{

  @Input() data: any;
  groupCollections: any[];
  groupLookupName: string;

  nameInput: string;
  dataObj: {}

  constructor(private router: Router) {}

  ngOnInit() {

    this.groupCollections = [UserGroups];
    this.groupLookupName = 'adminGroups';



  }

  returnResult(event) {
    console.log(event._id);
    this.router.navigate(['/adminGroups/' + event._id]);
  }

  addGroup (){
    console.log(Session.get('tenantId'))
    console.log(this.nameInput)

    if (this.nameInput !== undefined) {
      this.dataObj = {
        tenantId: Session.get('tenantId'),
        name: this.nameInput,
      }

      MeteorObservable.call('addGroup', this.dataObj).subscribe(groupInfo => {})
    } else {
      console.log("empty field")
    }
  }
}
