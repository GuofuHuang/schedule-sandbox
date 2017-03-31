import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { CreateQuotePage } from '../pages/createQuote/createQuote.page';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CustomerInquiryComponent } from '../components/customer-inquiry/customer-inquiry.component';
import { adminUsersPage } from '../pages/admin-users/admin-users.page';
import { adminEachUserComponent } from '../pages/admin-eachUser/admin-eachUser.component';
import { adminGroupsComponent } from '../pages/admin-groups/admin-groups.page';
import { adminEachGroupPage } from '../pages/admin-eachGroup/admin-eachGroup.page';
import { adminPermissionsPage } from '../pages/admin-permissions/admin-permissions.page';
import { adminEachPermissionPage } from '../pages/admin-eachPermission/admin-eachPermission.page';
import { systemLookupComponent } from '../pages/admin-systemLookup/admin-systemLookup.component';
import { eachSystemLookupPage } from '../pages/admin-eachSystemLookup/admin-eachSystemLookup.page';
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
      { path: 'adminUsers', component: adminUsersPage },
      { path: 'adminUsers/:userID', component: adminEachUserComponent },
      { path: 'adminGroups', component: adminGroupsComponent },
      { path: 'adminGroups/:groupID', component: adminEachGroupPage },
      { path: 'adminPermissions', component: adminPermissionsPage },
      { path: 'adminPermissions/:permissionID', component: adminEachPermissionPage },
      { path: 'adminLookup', component: systemLookupComponent },
      { path: 'adminLookup/:lookupID', component: eachSystemLookupPage },
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
