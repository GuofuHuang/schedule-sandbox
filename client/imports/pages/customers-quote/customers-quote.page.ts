import { Component } from '@angular/core';
import template from './customers-quote.page.html';
import style from './customers-quote.page.scss';
// import * as AuthenticationContext from 'adal-node';

// var pp = require('adal-node').AuthenticationContext;

@Component({
  selector: 'customers-quote',
  template,
  styles: [ style ]
})

export class CustomersQuotePage {

  sampleParameters = {
    tenant: 'globalthesource1.onmicrosoft.com',
    authorityHostUrl: 'https://login.windows.net',
    clientId: 'c1ab69e7-11c7-4934-b025-2eea8c9b8d27',
    clientSecret: 'c11GWnS6BuOg4Keq7DWbE02',
    username: '',
    password: ''
  };

  constructor() {
  }

  login() {

    const authorityUrl = this.sampleParameters + '/' + this.sampleParameters.tenant;
    const redirectUri = 'http://localhost:3000/getAToken';
    const resource = 'https://graph.microsoft.com';

    const templateAuthzUrl = 'https://login.windows.net/' + this.sampleParameters.tenant + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>';


  }
}
