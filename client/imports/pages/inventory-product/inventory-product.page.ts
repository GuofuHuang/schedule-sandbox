import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import { MdDialog } from '@angular/material';
import { DialogSelect } from '../../components/system-query/system-query.component';
import { Subscription } from 'rxjs/Subscription';
import { Random } from 'meteor/random';
import { Deep } from 'deep-diff';
import Dependency = Tracker.Dependency;
import { Products } from '../../../../both/collections/products.collection';

import { DialogComponent } from '../../components/dialog/dialog.component';

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
  originValue: any;
  dep: Dependency = new Dependency();
  nameDep: Dependency = new Dependency();
  bomsDep: Dependency = new Dependency();
  diff:any = require('deep-diff').diff;

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
  originProduct: any = {};
  subscription: Subscription;
  updateDocumentId: string;

  constructor(private route: ActivatedRoute, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
    var obj = {
      a: {
        b: [{
          c: 'Before'}]
      }
    };

    this.setToValue(obj, 'After', 'a.b.0.c');
    console.log('value', obj);


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
        MeteorObservable.call('findOne', 'products', query, {}).subscribe((result:any) => {
          if (result) {
            this.setProduct(result);
            MeteorObservable.subscribe('one_products', query, {}).subscribe(() => {
              MeteorObservable.autorun().subscribe(() => {
                let result:any = Products.collection.findOne(query);
                if (result) {

                  let differences = this.diff(this.originProduct, result);
                  console.log(differences);
                  console.log(this.originProduct, result);

                  if (differences) {
                    console.log('some differences', 'asdf');
                    differences.forEach((diff) => {
                      let paths = diff.path;
                      let strPaths = '';
                      paths.forEach((path, index) => {
                        if (index === 0) {
                          strPaths = path;
                        } else
                          strPaths += '.' + path;
                      });

                      switch(diff.kind) {
                        case "N": {

                          break;

                        }
                        case 'E': {
                          this.setToValue(this.product, diff.rhs, strPaths);
                          break;
                        }
                        case "D": {

                          // this.removeElementFromArray(this.product, diff.rhs, strPaths)

                          break;
                        }
                        case "A": {
                          if (diff.item.kind === 'N') {
                            this.addElementToArray(this.product, diff.item.rhs, strPaths);
                          } else if (diff.item.kind === 'D') {
                            console.log(diff);
                            this.removeElementFromArray(this.product, diff.item.lhs, strPaths)

                          }

                          break;
                        }

                      }

                    });
                  }
                }
              })
            });

          }
        });

        // MeteorObservable.subscribe('one_products', query, {fields: {boms: 1, name: 1}}).subscribe(() => {
            // subscribe the whole
            // let result:any  = Products.collection.findOne(query);
            // console.log('result', result);
            // MeteorObservable.call('findOne', 'products', query, {}).subscribe((res:any) => {
            //   res.boms.forEach((bom, index) => {
            //     MeteorObservable.autorun().subscribe(() => {
            //       console.log('2');
            //       let fields = {
            //         fields: {
            //           boms: {
            //             $slice: [0, 1]
            //           }
            //         }
            //       };
            //
            //       Products.collection.findOne(query, {});
            //       MeteorObservable.call('findOne', 'products', query, {}).subscribe((res:any) => {
            //         let bom = res.boms[index];
            //           bom.products.forEach((product, index) => {
            //             MeteorObservable.call('findOne', 'products', {_id: product.productId}, {}).subscribe((result:any) => {
            //               bom.products[index].name = result.name;
            //               bom.products[index].bomId = bom._id;
            //             })
            //
            //           })
            //
            //         this.product = res;
            //
            //       })
            //
            //     })
            //   });
            //   this.product = res;
            //
            // })
        });



    });
  }

  setProduct(result) {
    this.originProduct = Object.assign({}, result);
    result.boms.forEach(bom => {
      bom.products.forEach((product, index) => {
        MeteorObservable.call('findOne', 'products', {_id: product.productId}, {}).subscribe((res:any) => {
          bom.products[index].name = res.name;
          bom.products[index].bomId = bom._id;
        })
      })
    });
    this.product = Object.assign({}, result);
  }

  setToValue(obj, value, path) {
    let paths = path.split('.');
    let i;
    for (i = 0; i < paths.length-1; i++) {
      obj = obj[paths[i]];
      if (i === (paths.length-1)) {
        if (paths[i] === '$$index') {
          console.log('it is index');

        }
      }
    }
    obj[paths[i]] = value;

  }

  removeElementFromArray(obj:any, value, path) {
    let paths = path.split('.');
    let i;
    let test = false;
    if (paths.length > 2) {
      test = true;
    }
    for (i = 0; i < paths.length; i++) {
      obj = obj[paths[i]];
      if (i === (paths.length-1)) {
        obj.forEach((arr, index) => {
          if (arr._id === value._id) {
            obj.splice(index, 1);
          }
        })
      }
    }

  }

  addElementToArray(obj, value:any, path) {
    MeteorObservable.call('findOne', 'products', {_id: value.productId}).subscribe((res:any) => {
      let paths = path.split('.');
      let i;
      let test = false;
      if (paths.length > 2) {
        test = true;
        value.name = res.name;
      }
      for (i = 0; i < paths.length - 1; i++) {
        obj = obj[paths[i]];
        if (i === (paths.length-2)) {
          console.log(obj);
          value.bomId = obj._id;
        }
      }
      obj[paths[i]].push(value);
    })
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
      console.log('changes');
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

  removeSubProduct(obj) {
    let row = obj.row;
    let productIndex= obj.row.$$index;
    let itemId = obj.row._id;
    console.log('obj', obj);
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.product._id,
          "boms._id": row.bomId
        };
        let update = {
          "$pull": {
            "boms.$.products": {
              "_id": row._id
            }
          }
        };

        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          this.product.boms.some((bom, bomIndex) => {
            if (bom._id === row.bomId) {
              this.product.boms[bomIndex].products.splice(productIndex, 1);
            }
          })
          this._service.success(
            'Success',
            'Removed Successfully'
          );
        });

      }
    });
  }

  openProductsDialog(obj) {
    console.log('obj',obj);
    let assemblyId = obj.assemblyId;
    let index= obj.index;
    let dialogRef = this.dialog.open(DialogComponent);

    dialogRef.componentInstance.lookupName = 'productsList';

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newProduct:any = {
          _id: Random.id(),
          productId: result._id,
          quantity: 1
        };
        let query = {
          _id: this.product._id,
          "boms._id": assemblyId
        };
        let update = {
          $push: {
            "boms.$.products": newProduct
          }
        };
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          // this.dep.changed();
          // MeteorObservable.call('findOne', 'products', {_id: newProduct.productId}, {}).subscribe((result:any) => {
          //   newProduct.name = result.name;
          //   this.product.boms[index].products.push(newProduct);
          // });
        });
      }
    });
  }

  updateAssembly(obj) {
    let assemblyId = obj.assemblyId;
    let field = obj.name;
    let value = obj.value;
    let index = obj.index;
    if (/\S/.test(value)) {
      if (obj.value !== this.originValue) {
        MeteorObservable.call('findOne', 'products', {_id: this.productId}, {}).subscribe((product:any) => {
          let assemblies = product.boms;
          let exist = false;
          assemblies.some(assembly => {
            if (assembly.name === value) {
              exist = true;
              this._service.error(
                "Error",
                "Assembly Name already exists"
              );
              this.product.boms[index].name = this.originValue;
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
            MeteorObservable.call('update', 'products', query, update).subscribe(() => {
              // this.dep.changed();

            });
          }
        })
      }
    } else {
      this._service.error(
        "Error",
        "Assembly name cannot be empty"
      );
      this.product.boms[index].name = this.originValue;
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
        let newBom = {
          _id: Random.id(),
          products: [],
          name: assemblyName
        }
        let update = {
          $push: {
            "boms": newBom
          }
        };
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          this.product.boms.push(newBom);
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

  onFocus(obj) {
    this.originValue = obj.value;
    console.log('obj', obj);
  }

  removeAssembly(obj) {
    let assemblyId = obj.assemblyId;
    let index= obj.index;
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let update = {
          $pull: {
            "boms": {_id: assemblyId}
          }
        }
        MeteorObservable.call('update', 'products', {_id: this.productId}, update).subscribe(res => {
          this.product.boms.splice(index, 1);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
        });
      }
    });
  }
}
