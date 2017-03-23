import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { CreateQuoteComponent } from '../components/createQuote/create-quote.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CustomerInquiryComponent } from '../components/customer-inquiry/customer-inquiry.component';
import { adminUsersComponent } from '../pages/admin-users/admin-users.component';
import { adminEachUserComponent } from '../pages/admin-eachUser/admin-eachUser.component';
import { systemLookupComponent } from '../pages/admin-systemLookup/admin-systemLookup.component';
<<<<<<< HEAD
import { eachSystemLookupPage } from '../pages/admin-eachSystemLookup/admin-eachSystemLookup.page';
=======
>>>>>>> a80112471a0b83ca714fc8c95bc64c2357d1537f
import { CustomerMeetingsComponent } from '../pages/customer-meetings/customer-meetings.component';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: '', component: DashboardComponent,
    children: [
      { path: '', component: CreateQuoteComponent },
      { path: 'createQuote', component: CreateQuoteComponent },
      { path: 'customerInquiry', component: CustomerInquiryComponent },
<<<<<<< HEAD
      { path: 'adminUsers', component: adminUsersComponent },
      { path: 'adminUsers/:userID', component: adminEachUserComponent },
      { path: 'adminLookup', component: systemLookupComponent },
      { path: 'adminLookup/:lookupID', component: eachSystemLookupPage },
=======
      { path: 'admin-users', component: adminUsersComponent },
      { path: 'admin-users/:userID', component: adminEachUserComponent },
      { path: 'admin-lookup', component: systemLookupComponent },
>>>>>>> a80112471a0b83ca714fc8c95bc64c2357d1537f
      { path: 'customer/inquiry', component: CustomerInquiryComponent },
      { path: 'customer/meetings', component: CustomerMeetingsComponent },
      { path: 'customer', component: CustomerMeetingsComponent }
    ]
  }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
