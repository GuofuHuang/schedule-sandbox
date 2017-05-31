import { Component, OnInit, Input } from '@angular/core';
import template from './inventory-warehousebin.page.html';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { WarehouseBins } from '../../../../both/collections/warehouseBins.collection';
import {MeteorObservable} from "meteor-rxjs";
import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';
import { MdDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { DialogSelect } from '../../components/system-query/system-query.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import Dependency = Tracker.Dependency;

@Component({
  selector: 'inventory-warehousebin',
  template,
})

export class InventoryWarehouseBinPage implements OnInit{
  newProduct: FormGroup;

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true,
    query: {}
  };
  password: string;
  tenants: any = [];
  warehouse:any = {};
  warehouseBinId: string = '';
  warehouseBin: any = {};
  autoDep: Dependency = new Dependency();

  constructor(private route: ActivatedRoute, private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.warehouseBinId = params['id'];
      let query = {
        _id: this.warehouseBinId
      };
      MeteorObservable.autorun().subscribe(() => {
        this.autoDep.depend();
        MeteorObservable.call('findOne', 'warehouseBins', query, {}).subscribe((res:any) => {
          console.log(res);
          this.warehouseBin = res;
          MeteorObservable.call('findOne', 'warehouses', {_id: res.warehouseId}, {}).subscribe(res => {
            console.log(res)
            this.warehouse = res;
          })
        });

      })
    });

  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.lookupName = 'warehouses';
    dialogRef.componentInstance.data = {
      value: {
        $in: [null, false]
      },
      hidden: true,
      query: {}
    };

    dialogRef.afterClosed().subscribe(event => {
      if (event) {
        MeteorObservable.call('update', 'warehouseBins', {_id: this.warehouseBinId}, {$set: {warehouseId: event._id}})
          .subscribe(res => {
            this.autoDep.changed();
        });
      }
    });
  }

  removeDoc() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.warehouseBinId
        };
        let update = {
          $set: {
            removed: true
          }
        };
        MeteorObservable.call('update', 'warehouseBins', query, update).subscribe(res => {
          console.log(res);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
          this.router.navigate(['/inventory/warehousebins']);
          console.log('remove');
        });

      }
    });
  }

  onBlurMethod(target){
    let field = target.name;
    let value = target.value;
    let query = {
      _id: this.warehouseBinId
    }
    let update = {
      $set: {
        [field]: value
      }
    };
    console.log(field);
    console.log(update);
    MeteorObservable.call('update', 'warehouseBins', query, update).subscribe(res => {
      console.log(res);
    })
  }
}
