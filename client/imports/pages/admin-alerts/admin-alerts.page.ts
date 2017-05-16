import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';

import {filterDialogComponent} from '../../components/filterDialog/filterDialog.component';

import template from './admin-alerts.page.html';
import {MeteorObservable} from "meteor-rxjs";

@Component({
  selector: 'admin-alerts',
  template
})

export class AdminAlertsPage implements OnInit{
  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };
  newAlert: FormGroup;



  constructor(public dialog: MdDialog, private router: Router, private _service: NotificationsService) {}


  ngOnInit() {
    this.newAlert = new FormGroup({
      name: new FormControl('')
    })

  }

  startCron() {
    Meteor.call('startCron');
  }

  stopCron() {
    Meteor.call('stopCron');

  }

  addAlert() {
    MeteorObservable.autorun().subscribe(() => {
      if (Session.get('parentTenantId')) {
        let query = {
          name: this.newAlert.value.name,
          parentTenantId: Session.get('parentTenantId')
        }
        console.log(query);

        MeteorObservable.call('insert', 'systemAlerts', query).subscribe((res:any) => {
          console.log(res);

          this._service.success(
            "System Alert Added",
            this.newAlert.value.name,
            {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            }
          )

          this.router.navigate(['/admin/alert', res]);
        });

      }
    })
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

  onSelect(event) {
    console.log(event);
    // this.router.navigate(['/admin/alert/' + event._id]);
    this.router.navigate(['/admin/alerts',  event._id]);
  }

}
