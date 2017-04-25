import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs/Subscription';
import { Session } from 'meteor/session';

import { DialogComponent } from '../dialog/dialog.component';
import template from './dialog-system-lookup.component.html';
import { SystemLookups } from '../../../../both/collections/systemLookups.collection';

@Component({
  selector: 'dialog-system-lookup',
  template
})

export class DialogSystemLookupComponent implements OnInit, OnDestroy {
  @Input() Collections: any[];
  @Input() lookupName: string;

  selectItem: string;
  systemLookup: any;
  label: string;
  public subscriptions: Subscription[] = [];
  constructor(public dialog: MdDialog) {

  }

  ngOnInit() {
    this.subscriptions[0] = MeteorObservable.autorun().subscribe(() => {
      if (Session.get('parentTenantId')) {
        let query = {
          name: this.lookupName,
          parentTenantId: Session.get('parentTenantId')
        };
        this.subscriptions[1] = MeteorObservable.subscribe('systemLookups', query, {}, '').subscribe(() => {
          let query = {
            $or: [
              {
                _id: Session.get('parentTenantId')
              },
              {
                parentTenantId: Session.get('parentTenantId')
              }
            ]
          }

          this.subscriptions[2] = MeteorObservable.autorun().subscribe(() => {
            SystemLookups.collection.find({name: this.lookupName, tenantId: Session.get('tenantId')})
              .map(result => {
                this.systemLookup = result;
              });
            if (this.systemLookup) {
              console.log(this.systemLookup);
              this.label = this.systemLookup.label;
            }

          })
        });

      }
    })
  }

  select() {
    let dialogRef = this.dialog.open(DialogComponent, {
      height: "700px",
      width: "800px"
    });

    // dialogRef.componentInstance.Collections = this.Collections;
    dialogRef.componentInstance.lookupName = this.lookupName;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result != 'undefined')
        this.selectItem = result;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }
}
