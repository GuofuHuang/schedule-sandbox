import { Component, OnInit, Input } from '@angular/core';

import template from './inventory-dashboard.page.html';
import { Router } from '@angular/router';

@Component({
  selector: 'inventory-dashboard',
  template,
})

export class InventoryDashboardPage implements OnInit{

  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
