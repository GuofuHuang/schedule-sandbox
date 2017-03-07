import { Component, OnInit } from '@angular/core';
import template from './customer-inquiry.component.html';
import style from './customer-inquiry.component.scss';

@Component({
  selector: 'customer-inquiry',
  template,
  styles: [ style ]
})

export class CustomerInquiryComponent implements OnInit{
  constructor() {}

  ngOnInit() {}
}