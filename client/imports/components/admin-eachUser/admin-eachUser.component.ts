import { Component, OnInit, Input } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachUser.component.html';
import style from './admin-eachUser.component.scss';

@Component({
  selector: 'admin-eachUser',
  template,
  styles: [ style ]
})

export class adminEachUserComponent implements OnInit{

  @Input() data: any;
  userID: string;
  name: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    let userID
    let userInfo
    this.route.params.subscribe((params: Params) => {
     userID = params['userID'];
     console.log(userID);
    });

    MeteorObservable.call('returnUser', userID).subscribe(userInfo => {
      userInfo = userInfo;
      console.log(userInfo);
    })
    console.log(this)
  }
}
