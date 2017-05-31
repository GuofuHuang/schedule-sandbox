import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import template from './productBinsDialog.component.html';

@Component({
  selector: 'productBinsDialog-component',
  template
})

export class productBinsDialogComponent implements OnInit{

  updateDocumentId: string;
  text: string;
  event: any;
  data: any;

  constructor(public dialogRef: MdDialogRef<productBinsDialogComponent>){ }

  ngOnInit() {
    this.updateDocumentId = this.text;
    this.data = this.data;
  }
  // onSelect(event) {
  //   console.log(event);
  // }

  onChange(event) {
    console.log(event);
    this.dialogRef.close(event);
  }
}
