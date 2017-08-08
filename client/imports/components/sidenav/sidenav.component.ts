import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { trigger, state, style, animate, transition } from '@angular/animations';

import template from './sidenav.component.html';
import style1 from './sidenav.component.scss';
@Component({
  selector: 'sidenav',
  template,
  styles: [style1],
  animations: [
    trigger('sidenavState', [
      state('collapse', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('expand', style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('collapse => expand', animate('100ms ease-in')),
      transition('expand => collapse', animate('100ms ease-out'))
    ])
  ]
})

export class SidenavComponent implements OnInit, OnDestroy {
  menus: any = [];
  subMenus: any;
  selectedMenu: any = {};
  subscriptions: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.getMenus();
    // subscribe to collections to get updated automatically.
  }

  getMenus() {
    this.menus[0] = {
      url: '/customers',
      header: 'Customers',
      subMenus: [
        {
          name: 'Inquiry',
          url: '/inquiry'
        },
        {
          name: 'Quotes',
          url: '/quotes'
        },
        {
          name: 'Meetings',
          url: '/meetings'
        }
      ],
      collapse: false
    };
    this.menus[1] = {
      url: '/administrators',
      header: 'Administrators',
      subMenus: [
        {
          name: 'users',
          url: '/users'
        },
        {
          name: 'Permissions',
          url: '/permissions',
        },
        {
          name: 'Groups',
          url: '/groups'
        },
        {
          name: 'Lookups',
          url: '/lookups'
        },
        {
          name: 'Tenants',
          url: '/tenants'
        },
        {
          name: 'Alerts',
          url: '/alerts'
        }
      ],
      collapse: false
    };

  }

  getSelectedMenuName() {
  }

  onSelect(event) {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (typeof subscription === 'object') {
        subscription.unsubscribe();
      }
    })
  }
}
