import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs/Subscription';

import template from './login.component.html';
import style from './login.component.scss';
import { SystemTenants } from '../../../../both/collections/systemTenants.collection';

@Component({
  selector: 'login',
  template,
  styles: [ style ]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });


    this.error = '';



  }

  login() {
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
        this.zone.run(() => {
          if (err) {
            this.error = err;
            console.log(err);
          } else {
            console.log('passed');
            if (Meteor.userId()) {
              console.log(Session.get('subdomain'));
              let tenant;
              let query = {
                subdomain: Session.get('subdomain')
              };

              // MeteorObservable.call('findOne', 'systemTenants', query, {}).subscribe(res => {
              //   console.log(res);
              // })

              this.subscriptions[0] = MeteorObservable.subscribe('systemTenants', query, {}, '').subscribe(() => {
                this.subscriptions[1] = MeteorObservable.autorun().subscribe(() => {
                  tenant = SystemTenants.collection.findOne(query);
                  if (tenant) {
                    Session.set('parentTenantId', tenant._id);
                    Session.set('tenantId', tenant._id);
                  }
                })
              });
            }
            this.router.navigate(['/']);
          }
        });
      });
    }
  }

}