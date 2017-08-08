import { Component, OnInit } from '@angular/core';

import template from './customers-inquiry.component.html';
@Component({
  selector: 'customer-inquiry',
  template
})

export class CustomersInquiryComponent implements OnInit {
  menus = [];
  subMenus = [];

  constructor() {}

  ngOnInit() {

  }

  onSelect(event) {
  }
}
