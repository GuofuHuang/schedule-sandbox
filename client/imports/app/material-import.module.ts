import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk';

import {
  MdSidenavModule,
  MdToolbarModule,
  MdButtonModule,
  MdIconModule,
  MdCardModule,
  MdCheckboxModule,
  MdRadioModule,
  MdInputModule,
  MdListModule,
  MdProgressSpinnerModule,
  MdProgressBarModule,
  MdTabsModule,
  MdDialogModule,
  MdMenuModule,
  MdSnackBarModule,
  MdGridListModule,
  MdTableModule,
  MdSortModule,
  MdPaginatorModule
} from '@angular/material';

@NgModule({
  imports: [
    MdSidenavModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdCheckboxModule,
    MdRadioModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdTabsModule,
    MdDialogModule,
    MdMenuModule,
    MdSnackBarModule,
    MdGridListModule,
    FlexLayoutModule,
    MdTableModule,
    CdkTableModule,
    MdSortModule,
    MdPaginatorModule
  ],
  exports: [
    MdSidenavModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdCheckboxModule,
    MdRadioModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdTabsModule,
    MdDialogModule,
    MdMenuModule,
    MdSnackBarModule,
    MdGridListModule,
    FlexLayoutModule,
    MdTableModule,
    CdkTableModule,
    MdSortModule,
    MdPaginatorModule
  ]
})
export class MaterialImportModule {
}
