import { Component, OnInit, NgZone } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';
import template from './user-dropdown.component.html';

@Component({
  selector: 'user-dropdown',
  template
})

export class UserDropdownComponent implements OnInit {
  users: Observable<User[]>;
  user: User = {
    profile: {}
  };

  constructor(private ngZone: NgZone, private router: Router) {
  }

  ngOnInit() {
    MeteorObservable.autorun().subscribe(() => {
      Users.find({}).zone().subscribe((res) => {
        this.user = res[0];
      });
    });

  }

  logout() {
    Meteor.logout();
    this.router.navigate(['/login']);

  }
}