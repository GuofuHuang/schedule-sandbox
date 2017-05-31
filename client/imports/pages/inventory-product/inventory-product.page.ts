import { Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import {MdDialog} from '@angular/material';
import { DialogSelect } from '../../components/system-query/system-query.component';

import { Users } from '../../../../both/collections/users.collection';

import {productBinsDialogComponent} from '../../components/productBinsDialog/productBinsDialog.component';

import template from './inventory-product.page.html';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'inventory-product',
  template
})

export class InventoryProductPage implements OnInit{

  userCollections: any[];
  userLookupName: string;
  newUser: FormGroup;
  email: string;
  readonly: boolean = true;

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
  updateDocumentId: string;

  constructor(private route: ActivatedRoute, private router: Router, private _service: NotificationsService, public dialog: MdDialog) {}

  ngOnInit() {
    console.log(this.readonly);
    this.newUser = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });



    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.productId = params['id'];
      this.updateDocumentId = this.productId;

      let query = {
        _id: this.productId
      };

      MeteorObservable.call('findOne', 'products', query, {}).subscribe((res:any) => {
        console.log(res);
        // this.product.name = res.name;
        this.product = res;

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

  removeProduct() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let query = {
          _id: this.productId
        };
        let update = {
          $set: {
            removed: true
          }
        };
        MeteorObservable.call('update', 'products', query, update).subscribe(res => {
          console.log(res);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
          this.router.navigate(['/inventory/products']);
          console.log('remove');
        });

      }
    });
  }

  // openDialog() {
  //   let dialogRef = this.dialog.open(filterDialogComponent);
  //   dialogRef.afterClosed().subscribe(event => {
  //     console.log(event)
  //     let result = true;
  //     if (event === true) {
  //       result = false;
  //     }
  //     this.data = {
  //       value : event,
  //       hidden: result
  //     }
  //   });
  // }

  returnResult(event) {

    this.router.navigate(['/admin/users/' + event._id]);
  }

  addUser(user) {


    let tenants = this.tenants.map(tenant => {
      let temp = {
        _id: tenant._id,
        enabled: false,
        groups: [""]
      };
      return temp;
    });

    if (user.valid) {
      let newUser = {
        username: user.value.email,
        email: user.value.email,
        profile: {
          firstName: user.value.firstName,
          lastName: user.value.lastName
        },
        password: user.value.password,
        parentTenantId: Session.get('parentTenantId')
      }

      MeteorObservable.call('addUser', newUser).subscribe((res:any) => {
        this._service[res.result](
          res.subject,
          res.message
        )
        if (res.result === 'success') {
          this.router.navigate(['/admin/users', res.userId]);
        }
        // if (_id) {
        //   let query = {
        //     _id: _id
        //   };
        //   let update = {
        //     $set:{
        //       manages: [],
        //       tenants: tenants,
        //       parentTenantId: Session.get('parentTenantId')
        //     }
        //   };
        //   let args = [query, update];
        // }
        // MeteorObservable.call('update', 'users', ...args).subscribe((res) => {
        //   if (res) {
        //     this._service.success(
        //       'Success',
        //       'Create a user successfully'
        //     )
        //     this.router.navigate(['/admin/users/' + _id]);
        //   }
        // });

      });
    }
  }

  removeReadonly() {
    this.readonly = false;
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

    // let dialogRef = this.dialog.open(permissionModuleDialog)
    // let instance = dialogRef.componentInstance;
    // // console.log(instance)
    // instance.text = this.updateDocumentId;
  }
  //  //
  // onChange(event) {
  //   console.log(event);

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
