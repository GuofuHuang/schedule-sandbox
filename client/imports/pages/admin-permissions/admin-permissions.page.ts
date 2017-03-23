import { Component, OnInit, Input } from '@angular/core';

import template from './admin-permissions.page.html';
import style from './admin-permissions.page.scss';

@Component({
  selector: 'admin-permissions',
  template,
  styles: [ style ]
})

export class adminPermissionsPage implements OnInit{

  @Input() data: any;
  // userCollections: any[];
  // userLookupName: string;

  constructor() {}

  ngOnInit() {

    // this.userCollections = [Users];
    // this.userLookupName = 'users';



  }
}
