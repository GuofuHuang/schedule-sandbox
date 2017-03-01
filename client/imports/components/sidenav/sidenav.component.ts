import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { SystemOptions } from '../../../../both/collections/systemOptions.collection';
import { Groups } from '../../../../both/collections/groups.collection';

import template from './sidenav.component.html';


@Component({
  selector: 'sidenav',
  template
})

export class SidenavComponent implements OnInit {
  menus: any;
  subMenus: any;

  constructor() {}

  ngOnInit() {

    // subscribe to collections to get updated automatically.
    MeteorObservable.subscribe('systemOptions').subscribe();
    MeteorObservable.subscribe('groups').subscribe();

    MeteorObservable.autorun().subscribe(() => {
      SystemOptions.collection.find({}).fetch();
      MeteorObservable.call('getMenus', 'sidenav').subscribe( res => {
        this.menus = res;
      })
    })
  }

  onSelect(event) {
    MeteorObservable.autorun().subscribe(() => {
      SystemOptions.find({}).cursor.fetch();
      let t = Groups.find({}).cursor.fetch();
      console.log(t);
      MeteorObservable.call('getSubMenus', 'sidenav', event.name).subscribe(res => {
        this.subMenus = res;
      });
    });
  }
}