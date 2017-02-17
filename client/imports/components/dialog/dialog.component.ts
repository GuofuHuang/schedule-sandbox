import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import template from './dialog.component.html';

@Component({
  selector: 'dialog-component',
  template
})

export class DialogComponent implements OnInit{
  Collections: any[];
  lookupName: string;

  constructor(public dialogRef: MdDialogRef<DialogComponent>){ }

  ngOnInit() {

  }
  onSelect(event) {
    this.dialogRef.close(event);
  }
}