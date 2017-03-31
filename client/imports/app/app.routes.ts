import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { CreateQuoteComponent } from '../components/createQuote/create-quote.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CustomerInquiryComponent } from '../components/customer-inquiry/customer-inquiry.component';
import { adminUsersPage } from '../pages/admin-users/admin-users.page';
import { adminEachUserComponent } from '../pages/admin-eachUser/admin-eachUser.component';
import { adminPermissionsPage } from '../pages/admin-permissions/admin-permissions.page';
import { adminEachPermissionPage } from '../pages/admin-eachPermission/admin-eachPermission.page';
import { systemLookupComponent } from '../pages/admin-systemLookup/admin-systemLookup.component';
import { eachSystemLookupPage } from '../pages/admin-eachSystemLookup/admin-eachSystemLookup.page';
import { CustomerMeetingsComponent } from '../pages/customer-meetings/customer-meetings.component';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: '', component: DashboardComponent,
    children: [
      { path: '', component: CreateQuoteComponent },
      { path: 'createQuote', component: CreateQuoteComponent },
      { path: 'customerInquiry', component: CustomerInquiryComponent },
      { path: 'adminUsers', component: adminUsersPage },
      { path: 'adminUsers/:userID', component: adminEachUserComponent },
      { path: 'adminPermissions', component: adminPermissionsPage },
      { path: 'adminPermissions/:permissionID', component: adminEachPermissionPage },
      { path: 'adminLookup', component: systemLookupComponent },
      { path: 'adminLookup/:lookupID', component: eachSystemLookupPage },
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
