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
  updateDocumentId: string
  data: any = {};
  length: number;

  constructor(public dialogRef: MdDialogRef<DialogComponent>){ }

  ngOnInit() {
    console.log('asdf');
    console.log(this.data);
    // this.length = this.Collections.length;

  }
  onSelect(event) {
    this.dialogRef.close(event);
  }
}