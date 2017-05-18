import { Component, OnInit, Input } from '@angular/core';

import template from './manufacturing-dashboard.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'manufacturing-dashboard',
  template,
})

export class ManufacturingDashboardPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
