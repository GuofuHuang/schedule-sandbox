import { Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import {MdDialog} from '@angular/material';
import * as _ from "underscore";

import { Users } from '../../../../both/collections/users.collection';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './inventory-warehouses.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'inventory-warehouses',
  template
})

export class InventoryWarehousesPage implements OnInit{

  states = [];
  stateError: boolean = true;

  newWarehouse: FormGroup;
  warehouseArray: any;
  warehouseNameArray: any[];
  warehouseExistError: boolean = false;

  hideTable: boolean = false;
  hideAddForm: boolean = true;

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };
  password: string;
  tenants: any = [];

  constructor(private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {

    MeteorObservable.call('findOne', 'systemOptions', {name: 'states'}, {}).subscribe((res:any) => {
      this.states = res.value;
    })

    this.warehouseNameArray = []

    this.newWarehouse = new FormGroup({
      warehouse: new FormControl(''),
      description: new FormControl(''),
      address1: new FormControl(''),
      address2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zipCode: new FormControl('')
    })

    let selector = {
      $or: [
        {
          _id: Session.get('parentTenantId'),
        },
        {
          parentTenantId: Session.get('parentTenantId')
        }
      ]
    };
    let args = [selector];

    MeteorObservable.call('find', 'warehouses', {tenantId: Session.get('tenantId')}).subscribe(warehouseInfo => {
      this.warehouseArray = warehouseInfo
      for (let i = 0; i < this.warehouseArray.length; i++) {
          this.warehouseNameArray.push(warehouseInfo[i]["warehouse"])
      }
    })

  }

  stateSelection() {
    this.stateError = false;
  }

  warehouseExist(){
    this.warehouseExistError = _.contains(this.warehouseNameArray, this.newWarehouse.value.warehouse) ? true : false;
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

  onSelect(event) {
    this.router.navigate(['/inventory/warehouses',  event._id]);
  }

  addWarehouse(warehouse) {
    MeteorObservable.autorun().subscribe(() => {
      if (Session.get('tenantId')) {
        let query = {
          warehouse: this.newWarehouse.value.warehouse,
          description: this.newWarehouse.value.description,
          address1: this.newWarehouse.value.address1,
          address2: this.newWarehouse.value.address2,
          city: this.newWarehouse.value.city,
          state: this.newWarehouse.value.state,
          zipCode: this.newWarehouse.value.zipCode,
          tenantId: Session.get('tenantId')
        }
        console.log(query);

        MeteorObservable.call('insert', 'warehouses', query).subscribe((res:any) => {
          console.log(res);

          this._service.success(
            "Warehouse Added",
            this.newWarehouse.value.warehouse,
            {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            }
          )

          this.router.navigate(['/inventory/warehouses', res]);
        });

      }
    })
  }

}
