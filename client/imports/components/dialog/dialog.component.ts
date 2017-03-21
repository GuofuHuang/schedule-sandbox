import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import template from './dialog.component.html';

@Component({
  selector: 'dialog-component',
  template
})

export class DialogComponent implements OnInit{
  Collections: any[];
  lookupName: string;
  length: number;

  constructor(public dialogRef: MdDialogRef<DialogComponent>){ }

  ngOnInit() {
    this.length = this.Collections.length;

  }
  onSelect(event) {
    this.dialogRef.close(event);
  }
}