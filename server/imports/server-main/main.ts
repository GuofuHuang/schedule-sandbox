import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {Users} from '../../../both/collections/users.collection';
import {Accounts} from 'meteor/accounts-base';

import { Parties } from '../../../both/collections/parties.collection';

export class Main {
  start(): void {
    if (Parties.find().cursor.count() === 0) {
      const parties = [{
        name: 'Dubstep-Free Zone',
        description: 'Can we please just for an evening not listen to dubstep.',
        location: 'Palo Alto'
      }, {
        name: 'All dubstep all the time',
        description: 'Get it on!',
        location: 'Palo Alto'
      }, {
        name: 'Savage lounging',
        description: 'Leisure suit required. And only fiercest manners.',
        location: 'San Francisco'
      }];

      parties.forEach((party) => Parties.insert(party));
    }

  }
}
