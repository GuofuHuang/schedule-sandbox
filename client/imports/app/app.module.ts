import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdInputModule } from '@angular/material';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { routes, ROUTES_PROVIDERS } from './app.routes';

import { EqualValidator } from '../directives/equal-validator.directive';

import { LOGIN_DECLARATIONS } from '../components/login';
import { DASHBOARD_DECLARATIONS } from '../components/dashboard';
import { SYSTEMQUERY_DECLARATIONS } from '../components/system-query';
import { SIGNUP_DECLARATIONS } from '../components/signup';
import { CREATEQUOTE_DECLARATIONS } from '../pages/create-quote';
import { PIPES_DECLARATIONS } from '../pipes';
import { DIALOG_ENTRYCOMPONENTS } from '../components/dialog';
import { DIALOGSYSTEMLOOKUP_DECLARATIONS } from '../components/dialog-system-lookup';
import { SIDENAV_DECLARATIONS } from '../components/sidenav';
import { GLOBALSEARCH_DECLARATIONS } from '../components/global-search';
import { USERDROPDOWN_CLERATIONS } from '../components/user-dropdown';
import { FILTERDIALOG_ENTRYCOMPONENTS } from '../components/filterDialog';
import { CUSTOMERINQUIRY_DECLARATIONS } from '../components/customer-inquiry';
import { ADMINUSERS_DECLARATIONS } from '../pages/admin-users';
import { GUOFUTESTING_DECLARATIONS } from '../pages/guofu-testing';
import { ADMINSYSTEMLOOKUPS_DECLARATIONS } from '../pages/admin-systemLookups';
import { ADMINALERTS_DECLARATIONS } from '../pages/admin-alerts';
import { ADMINALERT_DECLARATIONS } from '../pages/admin-alert';
import { ADMINEACHUSERS_DECLARATIONS } from '../pages/admin-user';
import { ADMINGROUPS_DECLARATIONS } from '../pages/admin-groups';
import { ADMINGROUP_DECLARATIONS } from '../pages/admin-group';
import { ADMINPERMISSIONS_DECLARATIONS } from '../pages/admin-permissions';
import { ADMINPERMISSION_DECLARATIONS } from '../pages/admin-permission';
import { ADMINSYSTEMLOOKUP_DECLARATIONS } from '../pages/admin-systemLookup';
import { ADMINTENANTS_DECLARATIONS } from '../pages/admin-tenants';
import { ADMINTENANT_DECLARATIONS } from '../pages/admin-tenant';
import { CUSTOMERMEETINGS_DECLARATIONS } from '../pages/customer-meetings';
import { ADMINDASHBOARD_DECLARATIONS } from '../pages/admin-dashboard';
import { INVENTORYPRODUCTS_DECLARATIONS } from '../pages/inventory-products';
import { INVENTORYPRODUCT_DECLARATIONS } from '../pages/inventory-product';
import { VENDORSDASHBOARD_DECLARATIONS } from '../pages/vendors-dashboard';
import { INVENTORYDASHBOARD_DECLARATIONS } from '../pages/inventory-dashboard';
import { CUSTOMERSDASHBOARD_DECLARATIONS } from '../pages/customers-dashboard';
import { DEVELOPMENTDASHBOARD_DECLARATIONS } from '../pages/development-dashboard';
import { ACCOUNTINGDASHBOARD_DECLARATIONS } from '../pages/accounting-dashboard';
import { MANUFACTURINGDASHBOARD_DECLARATIONS } from '../pages/manufacturing-dashboard';


@NgModule({
  // Modules
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(routes),
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    AccountsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MdInputModule
  ],
  entryComponents: [
    DIALOG_ENTRYCOMPONENTS,
    DASHBOARD_DECLARATIONS,
    SIDENAV_DECLARATIONS,
    GLOBALSEARCH_DECLARATIONS,
    USERDROPDOWN_CLERATIONS,
    CUSTOMERINQUIRY_DECLARATIONS,
    ADMINUSERS_DECLARATIONS,
    ADMINEACHUSERS_DECLARATIONS,
    ADMINGROUPS_DECLARATIONS,
    ADMINGROUP_DECLARATIONS,
    ADMINPERMISSIONS_DECLARATIONS,
    ADMINPERMISSION_DECLARATIONS,
    ADMINSYSTEMLOOKUPS_DECLARATIONS,
    ADMINTENANTS_DECLARATIONS,
    ADMINSYSTEMLOOKUP_DECLARATIONS,
    CUSTOMERMEETINGS_DECLARATIONS,
    GUOFUTESTING_DECLARATIONS,
    SYSTEMQUERY_DECLARATIONS,
    ADMINALERTS_DECLARATIONS,
    ADMINALERT_DECLARATIONS,
    ADMINDASHBOARD_DECLARATIONS,
    ADMINTENANT_DECLARATIONS,
    FILTERDIALOG_ENTRYCOMPONENTS,
    INVENTORYPRODUCTS_DECLARATIONS,
    INVENTORYPRODUCT_DECLARATIONS,
    VENDORSDASHBOARD_DECLARATIONS,
    INVENTORYDASHBOARD_DECLARATIONS,
    CUSTOMERSDASHBOARD_DECLARATIONS,
    DEVELOPMENTDASHBOARD_DECLARATIONS,
    ACCOUNTINGDASHBOARD_DECLARATIONS,
    MANUFACTURINGDASHBOARD_DECLARATIONS

  ],
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    LOGIN_DECLARATIONS,
    SIGNUP_DECLARATIONS,
    PIPES_DECLARATIONS,
    CREATEQUOTE_DECLARATIONS,
    DIALOG_ENTRYCOMPONENTS,
    DIALOGSYSTEMLOOKUP_DECLARATIONS,
    DASHBOARD_DECLARATIONS,
    SIDENAV_DECLARATIONS,
    GLOBALSEARCH_DECLARATIONS,
    USERDROPDOWN_CLERATIONS,
    CUSTOMERINQUIRY_DECLARATIONS,
    ADMINUSERS_DECLARATIONS,
    ADMINEACHUSERS_DECLARATIONS,
    ADMINGROUPS_DECLARATIONS,
    ADMINGROUP_DECLARATIONS,
    ADMINPERMISSIONS_DECLARATIONS,
    ADMINPERMISSION_DECLARATIONS,
    ADMINSYSTEMLOOKUPS_DECLARATIONS,
    ADMINTENANTS_DECLARATIONS,
    ADMINSYSTEMLOOKUP_DECLARATIONS,
    CUSTOMERMEETINGS_DECLARATIONS,
    GUOFUTESTING_DECLARATIONS,
    SYSTEMQUERY_DECLARATIONS,
    ADMINALERTS_DECLARATIONS,
    ADMINALERT_DECLARATIONS,
    ADMINTENANT_DECLARATIONS,
    ADMINDASHBOARD_DECLARATIONS,
    EqualValidator,
    FILTERDIALOG_ENTRYCOMPONENTS,
    INVENTORYPRODUCTS_DECLARATIONS,
    INVENTORYPRODUCT_DECLARATIONS,
    VENDORSDASHBOARD_DECLARATIONS,
    INVENTORYDASHBOARD_DECLARATIONS,
    CUSTOMERSDASHBOARD_DECLARATIONS,
    DEVELOPMENTDASHBOARD_DECLARATIONS,
    ACCOUNTINGDASHBOARD_DECLARATIONS,
    MANUFACTURINGDASHBOARD_DECLARATIONS

  ],
  // Providers
  providers: [
    ...ROUTES_PROVIDERS,
    {provide: 'windowObject', useValue: window}
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {}
