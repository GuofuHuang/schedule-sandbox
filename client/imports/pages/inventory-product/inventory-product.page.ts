import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import { MdDialog } from '@angular/material';
import { DialogSelect } from '../../components/system-query/system-query.component';
import { Products } from '../../../../both/collections/products.collection';
import { Subscription } from 'rxjs/Subscription';
import { Random } from 'meteor/random';
import Dependency = Tracker.Dependency;

import { DialogComponent } from '../../components/dialog/dialog.component';
import { Users } from '../../../../both/collections/users.collection';

import {productBinsDialogComponent} from '../../components/productBinsDialog/productBinsDialog.component';

import template from './inventory-product.page.html';
import style from './inventory-product.page.scss';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'inventory-product',
  template,
  styles: [style]
})

export class InventoryProductPage implements OnInit, OnDestroy {
  @ViewChild('actionsTmpl') actionsTmpl: TemplateRef<any>; // used to remove the user

  email: string;
  hasManufacturing: boolean = false;
  columns:any = [];
  dep: Dependency = new Dependency();

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };
  password: string;
  tenants: any = [];
  productId: string;
  product: any = {};
  subscription: Subscription;
  updateDocumentId: string;

  constructor(private route: ActivatedRoute, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {

    MeteorObservable.autorun().subscribe(() => {
      if (Session.get('parentTenantId')) {
        let query = {
          _id: Session.get('parentTenantId')
        }
        MeteorObservable.call('findOne', 'systemTenants', query).subscribe((res:any) => {
          console.log(res);
          let modules = res.modules;
          let query = {
            name: "Manufacturing"
          };
          MeteorObservable.call('findOne', 'systemModules', query, {}).subscribe((module:any)=> {
            console.log('modules', module);
            modules.some(id => {
              if (id === module._id) {
                this.hasManufacturing = true;
                console.log('it has Manufacturing module');
              }
            })
          })

        })
      }
    })
    this.columns = [
      {
        name: "Name",
        prop: "name"
      },
      {
        name: "Quantity",
        prop: "quantity"
      },
      {
        name: "Actions",
        prop: "actions",
        cellTemplate: this.actionsTmpl
      }
    ]
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.productId = params['id'];
      this.updateDocumentId = this.productId;

      let query = {
        _id: this.productId
      };

      MeteorObservable.autorun().subscribe(() => {
        this.dep.depend();
        MeteorObservable.call('findOne', 'products', query, {}).subscribe((res:any) => {
          this.product = res;
          res.boms.forEach(bom => {
            bom.products.forEach((product, index) => {
              MeteorObservable.call('findOne', 'products', {_id: product.productId}, {}).subscribe((result:any) => {
                bom.products[index].name = result.name;
                bom.products[index].bomId = bom._id;

              })
            })
          })
        })
      })

    });
  }

  onBlurMethod(target){
    let field = target.name;
    let value = target.value;
    let query = {
      _id: this.productId
    }
    let update = {
      $set: {
        [field]: value
      }
    };
    console.log(field);
    console.log(update);
    MeteorObservable.call('update', 'products', query, update).subscribe(res => {
      console.log(res);
    })
  }

  removeProduct() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        MeteorObservable.call('remove', 'products', {_id: this.productId}, true).subscribe(res => {
          console.log(res);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
        });
      }
    });
  }

  removeSubProduct(row) {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.product._id,
          "boms._id": row.bomId
        };
        let update = {
          $pull: {
            "boms.$.products": {
              _id: row._id
            }
          }
        };
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          console.log(res);
          this.dep.changed();
          this._service.success(
            'Success',
            'Removed Successfully'
          );
        });

      }
    });
  }

  openProductsDialog(assemblyId) {
    let dialogRef = this.dialog.open(DialogComponent);

    dialogRef.componentInstance.lookupName = 'productsList';

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.product._id,
          "boms._id": assemblyId
        };
        let update = {
          $push: {
            "boms.$.products": {
              _id: Random.id(),
              productId: result._id,
              quantity: 0
            }
          }
        };
        console.log(query, update);
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          console.log(res);
          this.dep.changed();
        });

        console.log(update);
      }
    });
  }

  updateAssembly(assemblyId, target) {
    let field = target.name;
    let value = target.value;

    let assemblies = this.product.boms;
    let exist = false;
    assemblies.some(assembly => {
      if (assembly.name === value) {
        exist = true;
        this._service.error(
          "Error",
          "Assembly Name already exists, update failed"
        );
        this.dep.changed();
        return true;
      }
    });
    if (!exist) {
      let query = {
        _id: this.productId,
        "boms._id": assemblyId
      };
      let update = {
        $set: {
          "boms.$.name": value
        }
      };
      MeteorObservable.call('update', 'products', query, update).subscribe();
    }
  }

  updateSubProducts(assemblyId, row, target) {
    let field = target.name;
    let value = target.value;
    if (target.type === 'number') {
      value = target.valueAsNumber;
    }
    let query = {
      _id: this.product._id,
      "boms._id": assemblyId
    };
    let update = {
      $set: {
        "boms.$.products": {
          [field]: value
        }
      }
    };
    MeteorObservable.call('findOne', 'products', query, {}).subscribe((res:any) => {
      let boms = res.boms;
      boms.some(bom => {
        if (bom._id === assemblyId) {
          bom.products.some(product => {
            if (product._id === row._id) {
              product[field] = value;
              return true;
            }
          });
          console.log(bom.products);
          let update = {
            $set: {
              "boms.$.products": bom.products
            }
          };
          console.log(query, update);
          MeteorObservable.call('update', 'products', query, update).subscribe();
          return true;
        }
      });
    });
  }

  ngOnDestroy() {
  }

  onSelect(event) {
    console.log(event)
    let dialogRef = this.dialog.open(productBinsDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.text = this.updateDocumentId;
    instance.data = event;
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
