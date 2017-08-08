import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { CustomersQuotePage } from '../pages/customers-quote/customers-quote.page';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { CustomersMeetingsComponent } from '../pages/customers-meetings/customers-meetings.component';

export const routes: Route[] = [
  { path: '', component: DashboardComponent,
    children: [
      { path: '', component: CustomersQuotePage },
      { path: 'customers/quotes', component: CustomersQuotePage },
      { path: 'customers/meetings', component: CustomersMeetingsComponent },
      { path: 'customers/inquiry', component: CustomersMeetingsComponent },

    ]
  }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
