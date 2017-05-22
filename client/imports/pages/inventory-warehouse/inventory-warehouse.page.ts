import { Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import {MdDialog} from '@angular/material';
import { DialogSelect } from '../../components/system-query/system-query.component';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './inventory-warehouse.page.html';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'inventory-warehouse',
  template
})

export class InventoryWarehousePage implements OnInit{


  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };
  password: string;
  tenants: any = [];
  warehouseId: string;
  warehouse: any = {};

  constructor(private route: ActivatedRoute, private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.warehouseId = params['id'];
      let query = {
        _id: this.warehouseId
      };

      MeteorObservable.call('findOne', 'warehouses', query, {}).subscribe((res:any) => {
        console.log(res);
        this.warehouse = res;
        console.log(this.warehouse.description)
      })
    });
  }

  onBlurMethod(field, value){
    console.log(value)
    if (value !== "") {
      let query = {
        _id: this.warehouseId
      }
      let update = {
        $set: {
          [field]: value
        }
      };
      console.log(field);
      console.log(update);
      MeteorObservable.call('update', 'warehouses', query, update).subscribe(res => {
        console.log(res);
      })
    }
  }

  removeWarehouse() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.warehouseId
        };
        let update = {
          $set: {
            removed: true
          }
        };
        MeteorObservable.call('update', 'warehouses', query, update).subscribe(res => {
          console.log(res);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
          this.router.navigate(['/inventory/warehouses']);
          console.log('remove');
        });

      }
    });
  }

  openDialog() {
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

}
