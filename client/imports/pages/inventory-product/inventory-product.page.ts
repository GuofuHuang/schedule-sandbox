import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import { MdDialog } from '@angular/material';
import { DialogSelect } from '../../components/system-query/system-query.component';
import { Products } from '../../../../both/collections/products.collection';
import { Subscription } from 'rxjs/Subscription';
import { Random } from 'meteor/random';

import { DialogComponent } from '../../components/dialog/dialog.component';

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
  columns:any = [];

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

  constructor(private route: ActivatedRoute, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
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
      let query = {
        _id: this.productId
      };
      this.subscription = MeteorObservable.subscribe('products', query, {}, '').subscribe();

      MeteorObservable.autorun().subscribe(() => {
        Products.collection.find(query).fetch();
        MeteorObservable.call('findOne', 'products', query, {}).subscribe((res:any) => {
          console.log(res);
          this.product = res;
          console.log(res);
          res.boms.forEach(bom => {
            console.log(bom);
            bom.products.forEach((product, index) => {
              console.log(product);
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

  onBlurMethod(field, value){
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

  removeProduct(row) {
    console.log(row);
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
        console.log(query, update);
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          console.log(res);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
        });

      }
    });
  }

  openProductsDialog(assemblyId) {

    this.subscription.unsubscribe();
    let dialogRef = this.dialog.open(DialogComponent);

    dialogRef.componentInstance.lookupName = 'productsList';

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let query = {
        id: this.product._id,
        "boms._id": assemblyId
      }
      let update = {
        $push: {
          "boms.$.products": {
            _id: Random.id(),
            productId: result._id,
            quantity: 0
          }
        }
      };
      console.log(update);
      // MeteorObservable.call('update', 'products', query, update).subscribe();
      // console.log(event)
      // let result = true;
      // if (event === true) {
      //   result = false;
      // }
      // this.data = {
      //   value : event,
      //   hidden: result
      // }
    });
  }

  onBlur(assemblyId, row, target) {
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
    this.subscription.unsubscribe();
  }
}
