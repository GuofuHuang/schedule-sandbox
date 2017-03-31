import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { CreateQuotePage } from '../pages/createQuote/createQuote.page';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CustomerInquiryComponent } from '../components/customer-inquiry/customer-inquiry.component';
import { adminUsersComponent } from '../pages/admin-users/admin-users.component';
import { adminEachUserComponent } from '../pages/admin-eachUser/admin-eachUser.component';
import { CustomerMeetingsComponent } from '../pages/customer-meetings/customer-meetings.component';
import { GuofuTestingPage } from '../pages/guofu-testing/guofu-testing.page';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: '', component: DashboardComponent,
    children: [
      { path: '', component: CreateQuotePage },
      { path: 'createQuote', component: CreateQuotePage },
      { path: 'customerInquiry', component: CustomerInquiryComponent },
      { path: 'adminUsers', component: adminUsersComponent },
      { path: 'adminUsers/:userID', component: adminEachUserComponent },
      { path: 'customer/inquiry', component: CustomerInquiryComponent },
      { path: 'customer/meetings', component: CustomerMeetingsComponent },
      { path: 'customer', component: CustomerMeetingsComponent },
      { path: 'guofutesting', component: GuofuTestingPage }
    ]
  }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
