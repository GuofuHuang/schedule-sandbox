import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Router } from '@angular/router';
import { Session } from 'meteor/session';
import { Subscription } from 'rxjs/Subscription';

import { SystemOptions } from '../../../../both/collections/systemOptions.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';

import template from './sidenav.component.html';


@Component({
  selector: 'sidenav',
  template
})

export class SidenavComponent implements OnInit, OnDestroy {
  menus: any = [];
  subMenus: any;
  selectedMenu: any = {};
  subscriptions: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // subscribe to collections to get updated automatically.
    let selectedMenu = this.getSelectedMenuName();
    console.log(selectedMenu);
    let objSelectedMenu:any = {};
    if (selectedMenu !== '') {
      objSelectedMenu.name = selectedMenu;
    }
    console.log(objSelectedMenu);

    let query = {
      name: 'sidenav',
      default: true
    }
    this.subscriptions[0] = MeteorObservable.subscribe('systemOptions', query, {}, '').subscribe(() => {
      this.subscriptions[1] = MeteorObservable.autorun().subscribe(() => {
          let p = SystemOptions.collection.find({}).fetch();
          console.log(p);
          this.subscriptions[2] = MeteorObservable.call('getMenus', 'sidenav', Session.get('tenantId')).subscribe((res:any = []) => {
            this.menus = res;
            console.log(res);
            if (selectedMenu) {
              res.some(menu => {
                console.log(menu);
                if (menu.name == objSelectedMenu.name) {
                  this.selectedMenu = menu;

                  return true;
                }
              })
            }
          })
        });

      this.subscriptions[3] = MeteorObservable.autorun().subscribe(() => {
        if (objSelectedMenu.name) {

          this.subscriptions[4] = MeteorObservable.call('getSubMenus', Session.get('tenantId'), 'sidenav', this.selectedMenu.name).subscribe((res) => {
            this.subMenus = res;
          }, (err) => {
          });
        }
      });

    });
  }

  getSubMenus() {

  }

  getSelectedMenuName() {
    let selectedMenu = this.router.url.split('/');
    if (selectedMenu[1] !== '') {
      return selectedMenu[1];
    } else
      return 'customer';
  }

  onSelect(event) {
    MeteorObservable.call('getSubMenus', Session.get('tenantId'), 'sidenav', event.name).subscribe(res => {
      this.subMenus = res;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (typeof subscription === "object") {
        subscription.unsubscribe();
      }
    })
  }
}
