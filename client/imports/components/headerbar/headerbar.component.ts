import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'meteor/session';

import template from './headerbar.component.html';

@Component({
  selector: 'headerbar',
  template
})

export class HeaderbarComponent implements OnInit{
  tenants: any[];
  selectedCompany: any;

  constructor(private router: Router) {}

  ngOnInit() {
    let subdomain = Session.get('subdomain');
  }

  onSelect(event) {

    let splitHost = window.location.host.split('.');
    let host = splitHost[splitHost.length-1];
    let newUrl = window.location.protocol + '//' + event.subdomain + '.' + host;

    window.location.href = newUrl;
  }

}