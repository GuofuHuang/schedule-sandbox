import { Component, OnInit, Input } from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "underscore";
import { Session } from 'meteor/session';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';

import template from './admin-tenants.page.html';
import style from './admin-tenants.page.scss';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-tenants',
  template,
  styles: [ style ]
})

export class AdminTenantPage implements OnInit{

  @Input() data: any;
  states = [
    {
        "name": "Alabama",
        "code": "AL"
    },
    {
        "name": "Alaska",
        "code": "AK"
    },
    {
        "name": "American Samoa",
        "code": "AS"
    },
    {
        "name": "Arizona",
        "code": "AZ"
    },
    {
        "name": "Arkansas",
        "code": "AR"
    },
    {
        "name": "California",
        "code": "CA"
    },
    {
        "name": "Colorado",
        "code": "CO"
    },
    {
        "name": "Connecticut",
        "code": "CT"
    },
    {
        "name": "Delaware",
        "code": "DE"
    },
    {
        "name": "District Of Columbia",
        "code": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "code": "FM"
    },
    {
        "name": "Florida",
        "code": "FL"
    },
    {
        "name": "Georgia",
        "code": "GA"
    },
    {
        "name": "Guam",
        "code": "GU"
    },
    {
        "name": "Hawaii",
        "code": "HI"
    },
    {
        "name": "Idaho",
        "code": "ID"
    },
    {
        "name": "Illinois",
        "code": "IL"
    },
    {
        "name": "Indiana",
        "code": "IN"
    },
    {
        "name": "Iowa",
        "code": "IA"
    },
    {
        "name": "Kansas",
        "code": "KS"
    },
    {
        "name": "Kentucky",
        "code": "KY"
    },
    {
        "name": "Louisiana",
        "code": "LA"
    },
    {
        "name": "Maine",
        "code": "ME"
    },
    {
        "name": "Marshall Islands",
        "code": "MH"
    },
    {
        "name": "Maryland",
        "code": "MD"
    },
    {
        "name": "Massachusetts",
        "code": "MA"
    },
    {
        "name": "Michigan",
        "code": "MI"
    },
    {
        "name": "Minnesota",
        "code": "MN"
    },
    {
        "name": "Mississippi",
        "code": "MS"
    },
    {
        "name": "Missouri",
        "code": "MO"
    },
    {
        "name": "Montana",
        "code": "MT"
    },
    {
        "name": "Nebraska",
        "code": "NE"
    },
    {
        "name": "Nevada",
        "code": "NV"
    },
    {
        "name": "New Hampshire",
        "code": "NH"
    },
    {
        "name": "New Jersey",
        "code": "NJ"
    },
    {
        "name": "New Mexico",
        "code": "NM"
    },
    {
        "name": "New York",
        "code": "NY"
    },
    {
        "name": "North Carolina",
        "code": "NC"
    },
    {
        "name": "North Dakota",
        "code": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "code": "MP"
    },
    {
        "name": "Ohio",
        "code": "OH"
    },
    {
        "name": "Oklahoma",
        "code": "OK"
    },
    {
        "name": "Oregon",
        "code": "OR"
    },
    {
        "name": "Palau",
        "code": "PW"
    },
    {
        "name": "Pennsylvania",
        "code": "PA"
    },
    {
        "name": "Puerto Rico",
        "code": "PR"
    },
    {
        "name": "Rhode Island",
        "code": "RI"
    },
    {
        "name": "South Carolina",
        "code": "SC"
    },
    {
        "name": "South Dakota",
        "code": "SD"
    },
    {
        "name": "Tennessee",
        "code": "TN"
    },
    {
        "name": "Texas",
        "code": "TX"
    },
    {
        "name": "Utah",
        "code": "UT"
    },
    {
        "name": "Vermont",
        "code": "VT"
    },
    {
        "name": "Virgin Islands",
        "code": "VI"
    },
    {
        "name": "Virginia",
        "code": "VA"
    },
    {
        "name": "Washington",
        "code": "WA"
    },
    {
        "name": "West Virginia",
        "code": "WV"
    },
    {
        "name": "Wisconsin",
        "code": "WI"
    },
    {
        "name": "Wyoming",
        "code": "WY"
    }
]
public options = {
  timeOut: 5000,
  lastOnBottom: true,
  clickToClose: true,
  maxLength: 0,
  maxStack: 7,
  showProgressBar: true,
  pauseOnHover: true,
  preventDuplicates: false,
  preventLastDuplicates: 'visible',
  rtl: false,
  animate: 'scale',
  position: ['right', 'bottom']
};

dataObj: {};

tenantNameInput: string;
tenantAddress1Input: string;
tenantAddress2Input: string;
cityInput: string;
zipCodeInput: string;
stateInput: string;

stateError: boolean = true;

  constructor(private router: Router, private _service: NotificationsService) {}

  ngOnInit() {

  }

  checkIfNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  stateSelection(){
    this.stateError = false;
  }

  addTenant (){
    this.dataObj = {
      parentTenantId: Session.get('parentTenantId'),
      name: this.tenantNameInput,
      address1: this.tenantAddress1Input,
      address2: this.tenantAddress2Input,
      city: this.cityInput,
      zip: this.zipCodeInput,
      state: this.stateInput
    }

    console.log(this.dataObj)
    this._service.success(
      "Tenant Added",
      this.tenantNameInput,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )
    this.stateInput = undefined
    MeteorObservable.call('insertDocument', "systemTenants", this.dataObj).subscribe(tenantInfo => {})
  }
}
