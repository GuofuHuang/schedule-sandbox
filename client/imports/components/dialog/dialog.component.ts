import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {MD_DIALOG_DATA} from '@angular/material';

import template from './dialog.component.html';

@Component({
  selector: 'dialog-component',
  template
})

export class DialogComponent implements OnInit{
  lookupName: string;
  updateDocumentId: string
  data: any = {};
  length: number;

  constructor(public dialogRef: MdDialogRef<DialogComponent>){ }

  ngOnInit() {

  }
  onSelect(event) {
    console.log(event);
    this.dialogRef.close(event);
  }
}