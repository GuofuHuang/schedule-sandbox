import { Component, OnInit, Input } from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     let userID = params['userID'];
     console.log(userID);
   });
  }

  log(){
    console.log(event.target)
    console.log(event.currentTarget)
  }
}
