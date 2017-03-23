import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import {MeteorObservable} from "meteor-rxjs";
import template from './admin-eachPermission.page.html';
import style from './admin-eachPermission.page.scss';

@Component({
  selector: 'admin-eachPermission',
  template,
  styles: [ style ]
})

export class adminEachPermissionPage implements OnInit{

  @Input() data: any;
  permissionID: string;
  name: string;
  description: string;

  dataObj: {}

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.permissionID = params['permissionID'];
     console.log(this.permissionID);
    });

    MeteorObservable.call('returnPermission', this.permissionID).subscribe(permissionInfo => {
      console.log(permissionInfo);
      if (permissionInfo !== undefined) {
        this.name = permissionInfo["name"]
        this.description = permissionInfo["description"]
      }
    })

  }
  onBlurMethod(){
    let nameInput = (<HTMLInputElement>document.getElementById("nameInput")).value;
    // console.log(firstNameInput)
    let descriptionInput = (<HTMLInputElement>document.getElementById("descriptionInput")).value;
    // console.log(lastNameInput)

    this.dataObj = {
      id: this.permissionID,
      name: nameInput,
      description: descriptionInput,
    }
    console.log(this.dataObj)
    MeteorObservable.call('adminUpdatePermission', this.dataObj).subscribe(userInfo => {})
  }
}
