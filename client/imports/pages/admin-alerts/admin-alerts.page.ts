import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import template from './admin-alerts.page.html';

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

  constructor( private router: Router) {}


  ngOnInit() {

  }

  startCron() {
    Meteor.call('startCron');
  }

  stopCron() {
    Meteor.call('stopCron');

  }

  getPermission() {
  }

  onSelect(event) {
    console.log(event);
    // this.router.navigate(['/admin/alert/' + event._id]);
    this.router.navigate(['/admin/alert',  event._id]);
  }

}
