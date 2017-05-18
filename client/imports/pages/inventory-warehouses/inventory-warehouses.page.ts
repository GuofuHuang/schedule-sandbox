import { Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import {MdDialog} from '@angular/material';

import { Users } from '../../../../both/collections/users.collection';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './inventory-warehouses.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'inventory-warehouses',
  template
})

export class InventoryWarehousesPage implements OnInit{

  newProduct: FormGroup;

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
    this.newProduct = new FormGroup({
      name: new FormControl('')
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
    this.router.navigate(['/inventory/products',  event._id]);
  }

  addProduct(product) {
    console.log(product);
    MeteorObservable.autorun().subscribe(() => {
      if (Session.get('tenantId')) {
        let query = {
          name: this.newProduct.value.name,
          tenantId: Session.get('tenantId')
        }
        console.log(query);

        MeteorObservable.call('insert', 'products', query).subscribe((res:any) => {
          console.log(res);

          this._service.success(
            "Product Added",
            this.newProduct.value.name,
            {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            }
          )

          this.router.navigate(['/inventory/products', res]);
        });

      }
    })
  }

}
