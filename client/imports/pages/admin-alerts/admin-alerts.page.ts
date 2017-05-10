import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';

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



  constructor( private router: Router) {}


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
          this.router.navigate(['/admin/alert', res]);
        });

      }
    })
  }

  onSelect(event) {
    console.log(event);
    // this.router.navigate(['/admin/alert/' + event._id]);
    this.router.navigate(['/admin/alert',  event._id]);
  }

}
