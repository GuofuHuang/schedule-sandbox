import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import template from './productBinsDialog.component.html';

@Component({
  selector: 'productBinsDialog-component',
  template
})

export class productBinsDialogComponent implements OnInit{

  selections = [
    {
      value: {
        $in: [null, false]
      },
      label: 'Active'
    },
    {
      value: true,
      label: 'Removed'
    }
  ];

  data: any = {
    value: {
      $in: [null, false]
    },
    hidden: true
  };

  constructor(public dialogRef: MdDialogRef<productBinsDialogComponent>){ }

  ngOnInit() {

  }
  // onSelect(event) {
  //   console.log(event);
  // }

  onChange(event) {
    console.log(event);
    this.dialogRef.close(event);
  }
}
