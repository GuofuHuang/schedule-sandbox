import { Component, OnInit } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import { Session } from 'meteor/session';
import {NotificationsService } from 'angular2-notifications';
import {MdDialog} from '@angular/material';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './admin-tenants.page.html';
import style from './admin-tenants.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-tenants',
  template,
  styles: [ style ]
})

export class AdminTenantsPage implements OnInit{
  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };

  states = [];

  dataObj: {};

  hideTable: boolean = false;
  hideAddForm: boolean = true;

  tenantNameInput: string;
  tenantAddress1Input: string;
  tenantAddress2Input: string;
  cityInput: string;
  zipCodeInput: string;
  stateInput: string;

  stateError: boolean = true;

  constructor(private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
    let query = {
      name: "states"
    }

    MeteorObservable.call('findOne', 'systemOptions', {name: 'states'}, {}).subscribe((res:any) => {
      this.states = res.value;
    })

  }

  checkIfNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  stateSelection() {
    this.stateError = false;
  }

  addTenant() {
    this.dataObj = {
      parentTenantId: Session.get('parentTenantId'),
      name: this.tenantNameInput,
      address1: this.tenantAddress1Input,
      address2: this.tenantAddress2Input,
      city: this.cityInput,
      zip: this.zipCodeInput,
      state: this.stateInput
    }

    console.log(this.dataObj)
    this._service.success(
      "Tenant Added",
      this.tenantNameInput,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )
    this.stateInput = undefined
    MeteorObservable.call('insertDocument', "systemTenants", this.dataObj).subscribe(tenantInfo => {})

    this.hideAddForm = true
    this.hideTable = false
  }

  onSelect(event) {
    console.log(event);
    // this.router.navigate(['/admin/alert/' + event._id]);
    this.router.navigate(['/admin/tenants',  event._id]);
  }

  addButton(event) {
    this.hideAddForm = false
    this.hideTable = true
  }

  openDialog() {
    if (this.hideTable === false) {
      let dialogRef = this.dialog.open(filterDialogComponent);
      dialogRef.afterClosed().subscribe(event => {
        console.log(event)
        let result = true;
        if (event === true) {
          result = false;
        }
        this.data = {
          value : event,
          hidden: result
        }
      });
    }

    this.hideAddForm = true
    this.hideTable = false
  }

  // onChange(event) {
  //   console.log(event);
  //   let result = true;
  //   if (event === true) {
  //     result = false;
  //   }
  //   this.data = {
  //     value : event,
  //     hidden: result
  //   }
  // }

}
