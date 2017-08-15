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
import { MaterialImportModule } from './material-import.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Directives
import { EqualValidator } from '../directives/equal-validator.directive';
import { CollapseDirective } from '../directives/collapse.component';

// pages
import { DASHBOARD_DECLARATIONS } from '../pages/dashboard';
import { CREATEQUOTE_DECLARATIONS } from '../pages/customers-quote';
import { CUSTOMERMEETINGS_DECLARATIONS } from '../pages/customers-meetings';
import { CUSTOMERSINQUIRY_DECLARATIONS } from '../pages/customers-inquiry';

// components


@NgModule({
  // Modules
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    AccountsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MaterialImportModule,
    BrowserAnimationsModule

  ],
  entryComponents: [
  ],
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    // Components
    CUSTOMERSINQUIRY_DECLARATIONS,

    // pages
    CUSTOMERMEETINGS_DECLARATIONS,
    DASHBOARD_DECLARATIONS,
    CREATEQUOTE_DECLARATIONS,

    // directives
    CollapseDirective
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
