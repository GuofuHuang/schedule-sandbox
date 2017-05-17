import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { CustomersQuotePage } from '../pages/create-quote/customers-quote.page';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CustomerInquiryComponent } from '../components/customer-inquiry/customer-inquiry.component';
import { AdminUsersPage } from '../pages/admin-users/admin-users.page';
import { AdminUserComponent } from '../pages/admin-user/admin-user.component';
import { AdminGroupsComponent } from '../pages/admin-groups/admin-groups.page';
import { AdminGroupPage } from '../pages/admin-group/admin-group.page';
import { AdminPermissionsPage } from '../pages/admin-permissions/admin-permissions.page';
import { AdminPermissionPage } from '../pages/admin-permission/admin-permission.page';
import { AdminTenantsPage } from '../pages/admin-tenants/admin-tenants.page';
import { AdminTenantPage } from '../pages/admin-tenant/admin-tenant.page';
import { AdminAlertsPage } from '../pages/admin-alerts/admin-alerts.page';
import { AdminAlertPage } from '../pages/admin-alert/admin-alert.page';
import { AdminSystemLookupsPage } from '../pages/admin-systemLookups/admin-systemLookups.page';
import { AdminSystemLookupPage } from '../pages/admin-systemLookup/admin-systemLookup.page';
import { CustomerMeetingsComponent } from '../pages/customer-meetings/customer-meetings.component';
import { GuofuTestingPage } from '../pages/guofu-testing/guofu-testing.page';
import { AdminDashboardComponent } from '../pages/admin-dashboard/admin-dashboard.page';
import { InventoryProductsPage } from '../pages/inventory-products/inventory-products.page';
import { InventoryProductPage } from '../pages/inventory-product/inventory-product.page';
import { VendorsDashboardPage } from '../pages/vendors-dashboard/vendors-dashboard.page';
import { InventoryDashboardPage } from '../pages/inventory-dashboard/inventory-dashboard.page';
import { CustomersDashboardPage } from '../pages/customers-dashboard/customers-dashboard.page';
import { DevelopmentDashboardPage } from '../pages/development-dashboard/development-dashboard.page';
import { AccountingDashboardPage } from '../pages/accounting-dashboard/accounting-dashboard.page';
import { ManufacturingDashboardPage } from '../pages/manufacturing-dashboard/manufacturing-dashboard.page';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: '', component: DashboardComponent,
    children: [
      { path: '', component: CustomersQuotePage },
      { path: 'customers/quote', component: CustomersQuotePage },
      { path: 'admin/users', component: AdminUsersPage },
      { path: 'admin/users/:userId', component: AdminUserComponent },
      { path: 'admin/groups', component: AdminGroupsComponent },
      { path: 'admin/groups/:groupId', component: AdminGroupPage },
      { path: 'admin/permissions', component: AdminPermissionsPage },
      { path: 'admin/permissions/:permissionId', component: AdminPermissionPage },
      { path: 'admin/lookup', component: AdminSystemLookupsPage },
      { path: 'admin/lookup/:lookupId', component: AdminSystemLookupPage },
      { path: 'admin/tenants', component: AdminTenantsPage },
      { path: 'admin/tenants/:id', component: AdminTenantPage },
      { path: 'admin/alerts', component: AdminAlertsPage },
      { path: 'admin/alerts/:id', component: AdminAlertPage },
      { path: 'inventory', component: InventoryDashboardPage },
      { path: 'inventory/products', component: InventoryProductsPage },
      { path: 'inventory/products/:id', component: InventoryProductPage },
      { path: 'customers', component: CustomersDashboardPage },
      { path: 'customers/inquiry', component: CustomerInquiryComponent },
      { path: 'customers/meetings', component: CustomerMeetingsComponent },
      { path: 'development', component: DevelopmentDashboardPage },
      { path: 'development/guofutesting', component: GuofuTestingPage },
      { path: 'accounting', component: AccountingDashboardPage },
      { path: 'manufacturing', component: ManufacturingDashboardPage },
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'vendors', component: VendorsDashboardPage },

    ]
  }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
