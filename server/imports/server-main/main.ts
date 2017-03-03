import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {Users} from '../../../both/collections/users.collection';
import {Accounts} from 'meteor/accounts-base';
// import { UserRoles } from '../../../both/collections/userRoles.collection';

import { Mongo } from 'meteor/mongo';

import { Parties } from '../../../both/collections/parties.collection';

export class Main {
  start(): void {
    if (Meteor.isServer) {
    //put first and last names in their own fields and set email as username
        // let emails
        // let name
        // let firstName
        // let lastName
        // Users.collection.find({}).map(users => {
        //
        //   if (users.emails !== undefined) {
        //     emails = users.emails[0].address
        //   } else {
        //     emails = "NO EMAIL"
        //   }
        //
        //   if (users.username !== undefined) {
        //     name = users.username.split(' ');
        //     firstName = name[0]
        //     if (name[1] !== undefined) {
        //       lastName = name[1]
        //     } else {
        //       lastName = ""
        //     }
        //   } else {
        //     firstName = "FIRST"
        //     lastName = "LAST"
        //   }
        //   console.log(firstName, lastName, emails)
        //
        //   Meteor.users.update({_id: users._id}, {$set: {username: emails, firstName: firstName, lastName: lastName}})
        // });

        // Meteor.call('updateManagesAndGroups');
    }
  }
}
