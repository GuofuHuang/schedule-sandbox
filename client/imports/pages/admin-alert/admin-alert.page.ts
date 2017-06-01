import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import template from './admin-alert.page.html';
import { ActivatedRoute, Params, Router} from "@angular/router";
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { SystemAlerts } from '../../../../both/collections/systemAlerts.collection';

@Component({
  selector: 'admin-alert',
  template
})

export class AdminAlertPage implements OnInit{
  data: any={};

  alertId: string = '';
  name: string = '';
  email: any = {};
  start: boolean = false;
  status: string = '';
  alert: any = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}


  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.alertId = params['id'];
      let query = {
        _id: this.alertId
      };
      let options = {}
      MeteorObservable.subscribe('systemAlerts', query, options, '').subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {
          let result = SystemAlerts.collection.findOne(query, options);
          if (result) {
            this.email = result.email;
            if ('email' in result) {
              this.email = result.email;

            } else {
              this.email = {
                from: '',
                to: '',
                body: '',
                subject: ''
              }
            }
            if ('data' in result) {
              this.data = result.data;

            } else {
              this.data = {
                value: '',
                sentAt: '',
                updatedAt: ''
              }
            }
            this.alert = result;
          }



          // this.alert = SystemAlerts.collection.findOne();
          // console.log(this.alert);
        })
      })
    });

  }

  startCron() {
    Meteor.call('startCron');
  }

  stopCron() {
    Meteor.call('stopCron');

  }
  onBlurMethod(field, value){
    let query = {
      _id: this.alertId
    }
    let update = {
      $set: {
        [field]: value
      }
    };
    MeteorObservable.call('update', 'systemAlerts', query, update).subscribe(res => {
      console.log(res);
    })
  }
}
