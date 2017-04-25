import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Router } from '@angular/router';
import { Session } from 'meteor/session';

import { SystemOptions } from '../../../../both/collections/systemOptions.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';

import template from './sidenav.component.html';


@Component({
  selector: 'sidenav',
  template
})

export class SidenavComponent implements OnInit {
  menus: any = [];
  subMenus: any;
  selectedMenu: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    // subscribe to collections to get updated automatically.

    // this.getSelectedMenuName();
    // Session.set('selectedMenu', this.getSelectedMenuName());
    let selectedMenu = this.getSelectedMenuName();
    if (selectedMenu !== '') {
      this.selectedMenu.name = selectedMenu;
    }


    MeteorObservable.subscribe('systemOptions', Session.get('tenantId')).subscribe();
    // MeteorObservable.subscribe('groups', Session.get('tenantId')).subscribe();
    MeteorObservable.autorun().subscribe(() => {

      SystemOptions.collection.find({}, {
        fields: {
          'value.name': 1,
          'value.label': 1,
          'value.permissionName': 1
        }}).fetch();

      MeteorObservable.call('getMenus', 'sidenav', Session.get('tenantId')).subscribe((res:any = []) => {
        this.menus = res;
        if (selectedMenu) {
          res.some(menu => {
            if (menu.name == this.selectedMenu.name) {
              this.selectedMenu = menu;
            }
          })
        }
      })
    });

    MeteorObservable.autorun().subscribe(() => {
      SystemOptions.collection.find({}, {
        fields: {
          'value.subMenus': 1
        }
      }).fetch();
      if (this.selectedMenu.name) {

        MeteorObservable.call('getSubMenus', Session.get('tenantId'), 'sidenav', this.selectedMenu.name).subscribe((res) => {
          this.subMenus = res;
        }, (err) => {
          // console.log(err);
        });
      }
    });
  }

  getSelectedMenuName() {
    let selectedMenu = this.router.url.split('/');
    if (selectedMenu[1] !== '') {
      return selectedMenu[1];
    } else
      return '';
  }

  onSelect(event) {
    MeteorObservable.call('getSubMenus', Session.get('tenantId'), 'sidenav', event.name).subscribe(res => {
      this.subMenus = res;
    });
  }
}
