import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { SystemOptions } from '../../../../both/collections/systemOptions.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';

import template from './sidenav.component.html';


@Component({
  selector: 'sidenav',
  template
})

export class SidenavComponent implements OnInit {
  menus: any;
  subMenus: any;
  selectedMenu: any;

  cao: any;
  constructor() {}

  ngOnInit() {
    // subscribe to collections to get updated automatically.
    MeteorObservable.subscribe('systemOptions').subscribe();
    MeteorObservable.subscribe('groups').subscribe();

    MeteorObservable.autorun().subscribe(() => {
      console.log('menu change');
      SystemOptions.collection.find({}, {
        fields: {
          'value.name': 1,
          'value.label': 1,
          'value.permissionName': 1
        }}).fetch();

      Meteor.call('getMenus', 'sidenav', (err, res) => {
        this.menus = res;
      });
    })

    MeteorObservable.autorun().subscribe(() => {
      console.log('submenu change');
      SystemOptions.find({}, {
        fields: {
          'value.subMenus': 1
        }
      }).cursor.fetch();
      if (this.selectedMenu) {
        MeteorObservable.call('getSubMenus', 'sidenav', this.selectedMenu.name).subscribe(res => {
          this.subMenus = res;
        });
      }
    });
  }

  onSelect(event) {
    MeteorObservable.call('getSubMenus', 'sidenav', event.name).subscribe(res => {
      this.subMenus = res;
    });
  }
}
