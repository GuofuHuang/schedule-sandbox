import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import template from './login.component.html';
import style from './login.component.scss';

@Component({
  selector: 'login',
  template,
  styles: [ style ]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;

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
          } else {
            console.log('passed');
            this.router.navigate(['/createQuote']);
          }
        });
      });
    }
  }

}