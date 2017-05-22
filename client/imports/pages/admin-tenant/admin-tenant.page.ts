import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import template from './admin-tenant.page.html';
import { ActivatedRoute, Params, Router} from "@angular/router";
import {NotificationsService } from 'angular2-notifications';
import { MdDialog, MdDialogRef } from '@angular/material';

import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogSelect } from '../../components/system-query/system-query.component';
import {tenantModuleDialog} from '../../components/tenantModuleDialog/tenantModuleDialog.component';

@Component({
  selector: 'admin-tenant',
  template
})

export class AdminTenantPage implements OnInit{
  data: any={};

  tenantId: string = '';
  parentTenantId: string = '';
  moduleNames: any;
  name: string = '';
  email: any = {};
  start: boolean = false;
  status: string = '';
  tenant: any = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _service: NotificationsService, private dialog: MdDialog) {}


  ngOnInit() {
    this.parentTenantId = Session.get('parentTenantId');

    this.activatedRoute.params.subscribe((params: Params) => {
      this.tenantId = params['id'];
      let query = {
        _id: this.tenantId
      };
      let options = {}
        MeteorObservable.autorun().subscribe(() => {
          let result = SystemTenants.collection.findOne(query, options);
          let parentModules = SystemTenants.collection.findOne({_id: this.parentTenantId}, options);
          if (result) {
            this.tenant = result;
            MeteorObservable.call('returnPermissionNames', parentModules.modules).subscribe(moduleNames => {
              this.moduleNames = moduleNames;
            })
          }

        })
      })

  }

  onSelect(event) {
    console.log(event);
  }

  startCron() {
    Meteor.call('startCron');
  }

  stopCron() {
    Meteor.call('stopCron');

  }
  onBlurMethod(target){
    let field = target.name;
    let value = target.value;
    let query = {
      _id: this.tenantId
    }
    let update = {
      $set: {
        [field]: value
      }
    };
    console.log(field);
    console.log(update);
    MeteorObservable.call('update', 'systemTenants', query, update).subscribe(res => {
      console.log(res);
    })
  }

  removeTenant() {
    let dialogRef = this.dialog.open(DialogSelect);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let query = {
          _id: this.tenantId
        };
        let update = {
          $set: {
            removed: true
          }
        };
        MeteorObservable.call('update', 'systemTenants', query, update).subscribe(res => {
          console.log(res);
          this._service.success(
            'Success',
            'Removed Successfully'
          );
          this.router.navigate(['/admin/tenants']);
          console.log('remove');
        });

      }
    });
  }

  openDialog() {
    if (this.tenantId === this.parentTenantId) {
      this.dialog.open(tenantModuleDialog);
    }
  }
}
