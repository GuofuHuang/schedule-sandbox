import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Router } from '@angular/router';

import { SystemTenants } from '../../../../both/collections/systemTenants.collection';
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

    console.log('asdfasdf');

    let subdomain = Session.get('subdomain');

    // MeteorObservable.subscribe('systemTenants', Session.get('tenantId')).subscribe(() => {
    //   this.tenants = SystemTenants.collection.find({}).fetch();
    //   console.log(this.tenants);
    //   this.tenants.some((item, index) => {
    //     if (item.subdomain == subdomain) {
    //       this.selectedCompany = this.tenants[index];
    //       return true;
    //     }
    //   })
    // })

  }

  onSelect(event) {

    let splitHost = window.location.host.split('.');
    let host = splitHost[splitHost.length-1];
    let newUrl = window.location.protocol + '//' + event.subdomain + '.' + host;

    window.location.href = newUrl;
  }

}