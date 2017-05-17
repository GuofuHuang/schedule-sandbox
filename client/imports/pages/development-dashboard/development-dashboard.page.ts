import { Component, OnInit, Input } from '@angular/core';

import template from './development-dashboard.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'development-dashboard',
  template,
})

export class DevelopmentDashboardPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
