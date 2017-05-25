import { Component, OnInit, Input } from '@angular/core';
import template from './inventory-warehousebins.page.html';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Warehouses } from '../../../../both/collections/warehouses.collection';
import {MeteorObservable} from "meteor-rxjs";
import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';
import { MdDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'inventory-warehousebins',
  template,
})

export class InventoryWarehouseBinsPage implements OnInit{
  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true,
    query: {}
  };
  password: string;
  tenants: any = [];
  warehouses:any = [];
  warehouseIds:any = [];

  constructor(private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
    MeteorObservable.autorun().subscribe(() => {
      if (Session.get('tenantId')) {
        MeteorObservable.subscribe('warehouses', {tenantId: Session.get('tenantId')}, {}, '').subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.warehouses = Warehouses.collection.find().fetch();
            if (this.warehouses.length > 0) {
              this.warehouses.forEach(warehouse => {
                this.warehouseIds.push(warehouse._id)
              });
              let temp = Object.assign({}, this.data);

              temp.query = {
                $in: this.warehouseIds
              };
              this.data = {};
              this.data = temp;
              console.log(this.data.query);
              this.warehouses.unshift({
                name: 'All',
                _id: ''
              })
            }
          })
        })
      }
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(filterDialogComponent);
    dialogRef.afterClosed().subscribe(event => {
      if (event) {
        let result = true;
        if (event === true) {
          result = false;
        }
        let temp = Object.assign({}, this.data);
        temp.value = event;
        temp.hidden = result;
        this.data = {};
        this.data = temp;

      }
    });
  }

  onSelect(event) {
    Session.set('warehouseId', event._id);
    this.router.navigate(['/inventory/warehousebins',  event._id]);
  }

  onChange(event) {
    console.log(event);
    let temp = Object.assign({}, this.data);
    if (event._id) {
      temp.query = event._id;

    } else {
      temp.query = {
        $in: this.warehouseIds
      };
    }
    this.data = {};
    this.data = temp;
  }
}
