import { Component, OnInit, Input } from '@angular/core';

import template from './vendors-dashboard.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'vendors-dashboard',
  template,
})

export class VendorsDashboardPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
