import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { routes, ROUTES_PROVIDERS } from './app.routes';

import { LOGIN_DECLARATIONS } from '../components/login';
import { DASHBOARD_DECLARATIONS } from '../components/dashboard';
import { SYSTEMLOOKUP_DECLARATIONS } from '../components/system-lookup';
import { SIGNUP_DECLARATIONS } from '../components/signup';
import { CREATEQUOTE_DECLARATIONS } from '../components/createQuote';
import { PIPES_DECLARATIONS } from '../pipes';
import { DIALOG_ENTRYCOMPONENTS } from '../components/dialog';
import { DIALOGSYSTEMLOOKUP_DECLARATIONS } from '../components/dialog-system-lookup';
import { SIDENAV_DECLARATIONS } from '../components/sidenav';
import { GLOBALSEARCH_DECLARATIONS } from '../components/global-search';
import { USERDROPDOWN_CLERATIONS } from '../components/user-dropdown';
import { HEADERBAR_DECLARATIONS } from '../components/headerbar';
import { CUSTOMERINQUIRY_DECLARATIONS } from '../components/customer-inquiry';
import { ADMINUSERS_DECLARATIONS } from '../pages/admin-users';
import { ADMINEACHUSERS_DECLARATIONS } from '../pages/admin-eachUser';
import { CUSTOMERMEETINGS_DECLARATIONS } from '../pages/customer-meetings';
import { MULTISYSTEMLOOKUP_DECLARATIONS } from '../components/multi-system-lookup';
import { FIELDUPDATELOOKUP_DECLARATIONS } from '../components/field-update-lookup';

@NgModule({
  // Modules
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(routes),
    AccountsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  entryComponents: [
    SYSTEMLOOKUP_DECLARATIONS,
    DIALOG_ENTRYCOMPONENTS,
    DASHBOARD_DECLARATIONS,
    SIDENAV_DECLARATIONS,
    GLOBALSEARCH_DECLARATIONS,
    USERDROPDOWN_CLERATIONS,
    HEADERBAR_DECLARATIONS,
    CUSTOMERINQUIRY_DECLARATIONS,
    ADMINUSERS_DECLARATIONS,
    ADMINEACHUSERS_DECLARATIONS,
    CUSTOMERMEETINGS_DECLARATIONS,
    MULTISYSTEMLOOKUP_DECLARATIONS,
    FIELDUPDATELOOKUP_DECLARATIONS
  ],
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    LOGIN_DECLARATIONS,
    SIGNUP_DECLARATIONS,
    PIPES_DECLARATIONS,
    CREATEQUOTE_DECLARATIONS,
    SYSTEMLOOKUP_DECLARATIONS,
    DIALOG_ENTRYCOMPONENTS,
    DIALOGSYSTEMLOOKUP_DECLARATIONS,
    DASHBOARD_DECLARATIONS,
    SIDENAV_DECLARATIONS,
    GLOBALSEARCH_DECLARATIONS,
    USERDROPDOWN_CLERATIONS,
    HEADERBAR_DECLARATIONS,
    CUSTOMERINQUIRY_DECLARATIONS,
    ADMINUSERS_DECLARATIONS,
    ADMINEACHUSERS_DECLARATIONS,
    CUSTOMERMEETINGS_DECLARATIONS,
    MULTISYSTEMLOOKUP_DECLARATIONS,
    FIELDUPDATELOOKUP_DECLARATIONS
  ],
  // Providers
  providers: [
    ...ROUTES_PROVIDERS
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {}
