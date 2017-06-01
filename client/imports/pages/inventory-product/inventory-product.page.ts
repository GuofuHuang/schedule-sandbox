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
  showAddAssembly: boolean = false;
  email: string;
  hasManufacturing: boolean = false;
  columns:any = [];
  assemblyName: string = '';
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
          let modules = res.modules;
          let query = {
            name: "Manufacturing"
          };
          MeteorObservable.call('findOne', 'systemModules', query, {}).subscribe((module:any)=> {
            modules.some(id => {
              if (id === module._id) {
                this.hasManufacturing = true;
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
    MeteorObservable.call('update', 'products', query, update).subscribe(res => {
    })
  }

  removeProduct() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        MeteorObservable.call('remove', 'products', {_id: this.productId}, true).subscribe(res => {
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
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          this.dep.changed();
        });

      }
    });
  }

  updateAssembly(assemblyId, target) {
    let field = target.name;
    let value = target.value;
    if (/\S/.test(value)) {
      console.log('not empty');
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
    } else {
      this._service.error(
        "Error",
        "Assembly Name cannot be empty"
      );
      this.dep.changed();
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
          let update = {
            $set: {
              "boms.$.products": bom.products
            }
          };
          MeteorObservable.call('update', 'products', query, update).subscribe();
          return true;
        }
      });
    });
  }

  ngOnDestroy() {
  }

  onSelect(event) {
    let dialogRef = this.dialog.open(productBinsDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.text = this.updateDocumentId;
    instance.data = event;
    dialogRef.afterClosed().subscribe(event => {
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
  addAssembly(assemblyName) {
    if (/\S/.test(assemblyName)) {
      let assemblies = this.product.boms;
      let exist = false;
      assemblies.some(assembly => {
        if (assembly.name === assemblyName) {
          exist = true;
          this._service.error(
            "Error",
            "Assembly Name already exists, update failed"
          );
          return true;
        }
      });
      if (!exist) {
        let query = {
          _id: this.productId,
        };
        let update = {
          $push: {
            "boms": {
              _id: Random.id(),
              products: [],
              name: assemblyName
            }
          }
        };
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          this.dep.changed();
          this.showAddAssembly = false;
        });
      }
    } else {
      this._service.error(
        "Error",
        "Name cannot be empty"
      )
    }

  }

  removeAssembly(assemblyId) {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let update = {
          $pull: {
            "boms": {_id: assemblyId}
          }
        }
        MeteorObservable.call('update', 'products', {_id: this.productId}, update).subscribe(res => {
          this._service.success(
            'Success',
            'Removed Successfully'
          );
          this.dep.changed();
        });
      }
    });
  }
}
