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
  firstName: string;
  lastName: string;
  emailAddress: string;

  firstNameInput: string;
  lastNameInput: string;

  dataObj: {}

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.userID = params['userID'];
     console.log(this.userID);
    });

    MeteorObservable.call('returnUser', this.userID).subscribe(userInfo => {
      console.log(userInfo);
      // console.log(userInfo["emails"][0].address);
      if (userInfo !== undefined) {
        this.firstName = userInfo["profile"].firstName
        this.lastName = userInfo["profile"].lastName
        this.emailAddress = userInfo["emails"][0].address
      }
    })

  }
  onBlurMethod(){
    let firstNameInput = (<HTMLInputElement>document.getElementById("firstNameInput")).value;
    // console.log(firstNameInput)
    let lastNameInput = (<HTMLInputElement>document.getElementById("lastNameInput")).value;
    // console.log(lastNameInput)

    this.dataObj = {
      id: this.userID,
      firstName: firstNameInput,
      lastName: lastNameInput
    }
    console.log(this.dataObj)
    MeteorObservable.call('adminUpdateUser', this.dataObj).subscribe(userInfo => {})
    // if (this.firstNameInput !== undefined) {
    //   console.log("first",this.firstNameInput)
    // }
    // if (this.lastNameInput !== undefined) {
    //   console.log("last",this.lastNameInput)
    // }
  }
}
