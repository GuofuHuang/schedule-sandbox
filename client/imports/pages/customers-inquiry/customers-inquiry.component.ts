import { Component, OnInit } from '@angular/core';

import template from './customers-inquiry.component.html';

@Component({
  selector: 'customer-inquiry',
  template
})

export class CustomersInquiryComponent {
  menus = [];
  subMenus = [];

  constructor() {}

  onSelect(event) {
  }
}
