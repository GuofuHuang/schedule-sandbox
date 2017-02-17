import { Component } from '@angular/core';
import template from './app.component.html';
import style from './app.component.scss';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../both/collections/parties.collection';

Parties.find().map(parties => {
  console.log(parties);
})

@Component({
  selector: 'app',
  template,
  styles: [ style ]
})

@InjectUser('user')
export class AppComponent {
  parties: Observable<any[]>;

  constructor() {
    console.log('asdf');
    Parties.find().cursor.map(parties => {
      console.log(parties);
    })
    Parties.find().map(parties => {
      console.log(parties);
    })
    //this.parties = Parties.find({}).zone();
    // this.parties = [
    //   {'name': 'Dubstep-Free Zone',
    //     'description': 'Can we please just for an evening not listen to dubstep.',
    //     'location': 'Palo Alto'
    //   },
    //   {'name': 'All dubstep all the time',
    //     'description': 'Get it on!',
    //     'location': 'Palo Alto'
    //   },
    //   {'name': 'Savage lounging',
    //     'description': 'Leisure suit required. And only fiercest manners.',
    //     'location': 'San Francisco'
    //   }
    // ];

  }

  logout() {
    Meteor.logout();
  }

}
