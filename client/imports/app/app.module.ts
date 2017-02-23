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
import { TEST_DECLARATIONS } from '../components/test';
import { SYSTEMLOOKUP_DECLARATIONS } from '../components/system-lookup';
import { SIGNUP_DECLARATIONS } from '../components/signup';
import { CREATEQUOTE_DECLARATIONS } from '../components/createQuote';
import { PIPES_DECLARATIONS } from '../pipes';
import { DIALOG_ENTRYCOMPONENTS } from '../components/dialog';
import { DIALOGSYSTEMLOOKUP_DECLARATIONS } from '../components/dialog-system-lookup';

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
    TEST_DECLARATIONS
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
    TEST_DECLARATIONS
  ],
  // Providers
  providers: [
    ...ROUTES_PROVIDERS
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {}
