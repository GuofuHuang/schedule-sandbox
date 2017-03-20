import { Component, Input, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MeteorObservable } from 'meteor-rxjs';

import { DialogComponent } from '../dialog/dialog.component';
import template from './dialog-system-lookup.component.html';
import { SystemLookups } from '../../../../both/collections';

@Component({
  selector: 'dialog-system-lookup',
  template
})

export class DialogSystemLookupComponent implements OnInit {
  @Input() Collections: any[];
  @Input() lookupName: string;

  selectItem: string;
  systemLookup: any;
  label: string;
  constructor(public dialog: MdDialog) {

  }

  ngOnInit() {
    MeteorObservable.autorun().subscribe(() => {
      MeteorObservable.subscribe('systemLookups', this.lookupName, Session.get('tenantId')).subscribe(() => {
        SystemLookups.collection.find({name: this.lookupName, tenantId: Session.get('tenantId')})
          .map(result => {
            this.systemLookup = result;
          });
        this.label = this.systemLookup.label;
      });

    })
  }

  select() {
    let dialogRef = this.dialog.open(DialogComponent, {
      height: "600px",
      width: "800px"
    });

    dialogRef.componentInstance.Collections = this.Collections;
    dialogRef.componentInstance.lookupName = this.lookupName;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result != 'undefined')
        this.selectItem = result;
    });

  }
}