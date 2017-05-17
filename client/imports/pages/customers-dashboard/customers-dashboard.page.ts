import { Component, OnInit, Input } from '@angular/core';

import template from './customers-dashboard.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'customers-dashboard',
  template,
})

export class CustomersDashboardPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
