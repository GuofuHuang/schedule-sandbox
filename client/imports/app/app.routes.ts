import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { CreateQuotePage } from '../pages/create-quote/create-quote.page';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CustomerInquiryComponent } from '../components/customer-inquiry/customer-inquiry.component';
import { adminUsersPage } from '../pages/admin-users/admin-users.page';
import { adminEachUserComponent } from '../pages/admin-eachUser/admin-eachUser.component';
import { AdminGroupsComponent } from '../pages/admin-groups/admin-groups.page';
import { adminEachGroupPage } from '../pages/admin-eachGroup/admin-eachGroup.page';
import { adminPermissionsPage } from '../pages/admin-permissions/admin-permissions.page';
import { adminEachPermissionPage } from '../pages/admin-eachPermission/admin-eachPermission.page';
import { AdminTenantsPage } from '../pages/admin-tenants/admin-tenants.page';
import { AdminTenantPage } from '../pages/admin-tenant/admin-tenant.page';
import { AdminAlertsPage } from '../pages/admin-alerts/admin-alerts.page';
import { AdminAlertPage } from '../pages/admin-alert/admin-alert.page';
import { systemLookupComponent } from '../pages/admin-systemLookup/admin-systemLookup.component';
import { eachSystemLookupPage } from '../pages/admin-eachSystemLookup/admin-eachSystemLookup.page';
import { CustomerMeetingsComponent } from '../pages/customer-meetings/customer-meetings.component';
import { GuofuTestingPage } from '../pages/guofu-testing/guofu-testing.page';
import { AdminDashboardComponent } from '../pages/admin-dashboard/admin-dashboard.page';
import { InventoryProductsPage } from '../pages/inventory-products/inventory-products.page';
import { InventoryProductPage } from '../pages/inventory-product/inventory-product.page';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: '', component: DashboardComponent,
    children: [
      { path: '', component: CreateQuotePage },
      { path: 'create-quote', component: CreateQuotePage },
      { path: 'admin/users', component: adminUsersPage },
      { path: 'admin/users/:userID', component: adminEachUserComponent },
      { path: 'admin/groups', component: AdminGroupsComponent },
      { path: 'admin/groups/:groupID', component: adminEachGroupPage },
      { path: 'admin/permissions', component: adminPermissionsPage },
      { path: 'admin/permissions/:permissionID', component: adminEachPermissionPage },
      { path: 'admin/lookup', component: systemLookupComponent },
      { path: 'admin/lookup/:lookupID', component: eachSystemLookupPage },
      { path: 'admin/tenants', component: AdminTenantsPage },
      { path: 'admin/tenants/:id', component: AdminTenantPage },
      { path: 'admin/alerts', component: AdminAlertsPage },
      { path: 'admin/alerts/:id', component: AdminAlertPage },
      { path: 'inventory/products', component: InventoryProductsPage },
      { path: 'inventory/products/:id', component: InventoryProductPage },
      { path: 'customer/inquiry', component: CustomerInquiryComponent },
      { path: 'customer/meetings', component: CustomerMeetingsComponent },
      { path: 'customer', component: CustomerMeetingsComponent },
      { path: 'guofutesting', component: GuofuTestingPage },
      { path: 'admin', component: AdminDashboardComponent }
    ]
  }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
