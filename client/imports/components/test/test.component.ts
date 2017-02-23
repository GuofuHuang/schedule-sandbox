import { Component, Input, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import template from './test.component.html';

@Component({
  selector: 'test',
  template
})

export class TestComponent implements OnInit {

  rows: any[];
  columns: any[];

  label: string;
  constructor() {

  }

  ngOnInit() {
    this.rows = [
      { name: 'Austin', gender: 'Male', company: 'Swimlane' },
      { name: 'Dany', gender: 'Male', company: 'KFC' },
      { name: 'Molly', gender: 'Female', company: 'Burger King' },
    ];
    this.columns = [
      { prop: 'name' },
      { name: 'Gender' },
      { name: 'Company' }
    ];

  }

}