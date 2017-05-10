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
import { CUSTOMERINQUIRY_DECLARATIONS } from '../components/customer-inquiry';
import { ADMINUSERS_DECLARATIONS } from '../pages/admin-users';
import { GUOFUTESTING_DECLARATIONS } from '../pages/guofu-testing';
import { ADMINSYSTEMLOOKUP_DECLARATIONS } from '../pages/admin-systemLookup';
import { ADMINALERTS_DECLARATIONS } from '../pages/admin-alerts';
import { ADMINALERT_DECLARATIONS } from '../pages/admin-alert';
import { ADMINEACHUSERS_DECLARATIONS } from '../pages/admin-eachUser';
import { ADMINGROUPS_DECLARATIONS } from '../pages/admin-groups';
import { ADMINEACHGROUP_DECLARATIONS } from '../pages/admin-eachGroup';
import { ADMINPERMISSIONS_DECLARATIONS } from '../pages/admin-permissions';
import { ADMINEACHPERMISSION_DECLARATIONS } from '../pages/admin-eachPermission';
import { EACHSYSTEMLOOKUP_DECLARATIONS } from '../pages/admin-eachSystemLookup';
import { ADMINTENANTS_DECLARATIONS } from '../pages/admin-tenants';
import { ADMINTENANT_DECLARATIONS } from '../pages/admin-tenant';
import { CUSTOMERMEETINGS_DECLARATIONS } from '../pages/customer-meetings';
import { ADMINDASHBOARD_DECLARATIONS } from '../pages/admin-dashboard';

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
    ADMINEACHGROUP_DECLARATIONS,
    ADMINPERMISSIONS_DECLARATIONS,
    ADMINEACHPERMISSION_DECLARATIONS,
    ADMINSYSTEMLOOKUP_DECLARATIONS,
    ADMINTENANTS_DECLARATIONS,
    EACHSYSTEMLOOKUP_DECLARATIONS,
    CUSTOMERMEETINGS_DECLARATIONS,
    GUOFUTESTING_DECLARATIONS,
    SYSTEMQUERY_DECLARATIONS,
    ADMINALERTS_DECLARATIONS,
    ADMINALERT_DECLARATIONS,
    ADMINDASHBOARD_DECLARATIONS,
    ADMINTENANT_DECLARATIONS
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
    ADMINEACHGROUP_DECLARATIONS,
    ADMINPERMISSIONS_DECLARATIONS,
    ADMINEACHPERMISSION_DECLARATIONS,
    ADMINSYSTEMLOOKUP_DECLARATIONS,
    ADMINTENANTS_DECLARATIONS,
    EACHSYSTEMLOOKUP_DECLARATIONS,
    CUSTOMERMEETINGS_DECLARATIONS,
    GUOFUTESTING_DECLARATIONS,
    SYSTEMQUERY_DECLARATIONS,
    ADMINALERTS_DECLARATIONS,
    ADMINALERT_DECLARATIONS,
    ADMINTENANT_DECLARATIONS,
    ADMINDASHBOARD_DECLARATIONS,
    EqualValidator
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
