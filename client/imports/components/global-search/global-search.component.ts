import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';

import template from './global-search.component.html';


@Component({
  selector: 'global-search',
  template
})

export class GlobalSearchComponent implements OnInit {
  menus: any;
  subMenus: any;

  constructor() {
  }

  ngOnInit() {

  }

  search(keywords) {
    MeteorObservable.call('globalSearch', keywords).subscribe(res => {
      console.log(res);
    })
  }


}