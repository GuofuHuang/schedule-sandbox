import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "underscore";
import { Session } from 'meteor/session';

import template from './admin-dashboard.page.html';
import style from './admin-dashboard.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  template,
  styles: [ style ]
})

export class AdminDashboardComponent implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
