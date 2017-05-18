import { Component, OnInit, Input } from '@angular/core';

import template from './accounting-dashboard.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'accounting-dashboard',
  template,
})

export class AccountingDashboardPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
