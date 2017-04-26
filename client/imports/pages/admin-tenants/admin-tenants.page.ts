import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "underscore";
import { Session } from 'meteor/session';

import template from './admin-tenants.page.html';
import style from './admin-tenants.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-tenants',
  template,
  styles: [ style ]
})

export class AdminTenantPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {

  }

  // groupExist(){
  //   this.groupExistError = _.contains(this.groupNameArray, this.nameInput) ? true : false;
  // }
}
