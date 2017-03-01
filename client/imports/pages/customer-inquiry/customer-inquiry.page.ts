import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';

import { SystemOptions } from '../../../../both/collections/systemOptions.collection';

import template from './customer-inquiry.page.html';


@Component({
  selector: 'sidenav',
  template
})

export class CustomerInquiryPage implements OnInit{
  menus = [];
  subMenus = [];

  constructor() {}

  ngOnInit() {

    MeteorObservable.subscribe('systemOptions').subscribe();
    MeteorObservable.autorun().subscribe(() => {

      console.log(SystemOptions.find({}).cursor.fetch());
      console.log('asdf');

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