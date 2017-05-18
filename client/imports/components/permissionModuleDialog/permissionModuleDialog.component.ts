import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import template from './permissionModuleDialog.component.html';

@Component({
  selector: 'permissionModuleDialog-component',
  template
})

export class permissionModuleDialog implements OnInit{

  updateDocumentId: string;
  text: string;
  constructor(private route: ActivatedRoute,  private router: Router, public dialogRef: MdDialogRef<permissionModuleDialog>){ }

  ngOnInit() {
    this.updateDocumentId = this.text
  }
  // onSelect(event) {
  //   console.log(event);
  // }

  // onChange(event) {
  //   console.log(event);
  //   this.dialogRef.close(event);
  // }
}
