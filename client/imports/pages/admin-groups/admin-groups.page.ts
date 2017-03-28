import { Component, OnInit, Input } from '@angular/core';
import { UserGroups } from '../../../../both/collections/userGroups.collection';

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
    console.log(this.nameInput)
    // MeteorObservable.call('addGroup', this.nameInput).subscribe(updateInfo => {})
  }
}
