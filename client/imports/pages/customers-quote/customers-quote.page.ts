import { Component } from '@angular/core';
import { HTTP } from 'meteor/http'
import {MdSnackBar} from '@angular/material';

const moment = require('moment');
import template from './customers-quote.page.html';
import style from './customers-quote.page.scss';

@Component({
  selector: 'customers-quote',
  template,
  styles: [style],
})

export class CustomersQuotePage {

  constructor(public snackBar: MdSnackBar) { }

  private workingOnBackground = false;
	private eventCreated = false;
	private authorized = false;
	private subject = null;
	private start = null;
	private end = null;

  addMeeting() {
    this.workingOnBackground = true;
    HTTP.call('GET', '/auth', { content: 'string' }, (err, tokenResult) => {
      if (!err) {
        var token = tokenResult.content;
        HTTP.call('POST', '/addMeeting', { 
          data: { token: token}
        }, (err, eventResult) => {
          if (!err) {
            
            var event = JSON.parse(eventResult.content);
            this.subject = event.subject;
						this.start = moment(event.start.dateTime).format('DD MMM, yyyy');
						this.end = moment(event.end.dateTime).format('DD MMM, yyyy');

						this.workingOnBackground = false;
            this.eventCreated = true;
          } else {
            this.eventCreated = false;
				    this.workingOnBackground = false;
            this.snackBar.open(JSON.stringify(err));
          }
        });
      }
    });
  }


}