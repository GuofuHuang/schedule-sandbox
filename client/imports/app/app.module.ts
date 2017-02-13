import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { AccountsModule } from 'angular2-meteor-accounts-ui';

import { routes, ROUTES_PROVIDERS } from './app.routes';

import { LOGIN_DECLARATIONS } from '../components/login';
import { SIGNUP_DECLARATIONS } from '../components/signup';
import { CREATEQUOTE_DECLARATIONS, CREATEQUOTE_ENTRYCOMPONENTS } from '../components/createQuote';
import { PIPES_DECLARATIONS } from '../pipes';

@NgModule({
  // Modules
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(routes),
    AccountsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    CREATEQUOTE_ENTRYCOMPONENTS
  ],
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    LOGIN_DECLARATIONS,
    SIGNUP_DECLARATIONS,
    PIPES_DECLARATIONS,
    CREATEQUOTE_DECLARATIONS
  ],
  // Providers
  providers: [
    ...ROUTES_PROVIDERS
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {}
