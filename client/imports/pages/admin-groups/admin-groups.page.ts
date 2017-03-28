import { Component, OnInit, Input } from '@angular/core';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import {MeteorObservable} from "meteor-rxjs";

import template from './admin-groups.page.html';
import style from './admin-groups.page.scss';

@Component({
  selector: 'admin-groups',
  template,
  styles: [ style ]
})

export class adminGroupsComponent implements OnInit{

  @Input() data: any;
  groupCollections: any[];
  groupLookupName: string;

  nameInput: string;
  dataObj: {}

  constructor() {}

  ngOnInit() {

    this.groupCollections = [UserGroups];
    this.groupLookupName = 'adminGroups';



  }

  returnResult(event) {
    console.log(event._id);
    // this.router.navigate(['/adminGroups/' + event._id]);
  }

  addGroup (){
    console.log(Session.get('tenantId'))
    console.log(this.nameInput)
    
    this.dataObj = {
      tenantId: Session.get('tenantId'),
      name: this.nameInput,
    }

    MeteorObservable.call('addGroup', this.dataObj).subscribe(groupInfo => {})
  }
}
