import { Component, OnInit } from '@angular/core';
import {MongoObservable, MeteorObservable} from 'meteor-rxjs';

import template from './sidenav.component.html';


@Component({
  selector: 'sidenav',
  template
})

export class SidenavComponent implements OnInit{
  menus = [];
  subMenus = [];

  constructor() {}

  ngOnInit() {

    MeteorObservable.autorun().subscribe(() => {
      Meteor.call('getMenus', 'sidenav', (err, res) => {
        this.menus = res;
        // Meteor.call('getSubMenus', 'sidenav', 'customer', (err, res) => {
        //   console.log(err, res);
        // })
      });
    })

  }

  onSelect(event) {
    Meteor.call('getSubMenus', 'sidenav', event.name, (err, res) => {
      this.subMenus = res;
    })
  }
}