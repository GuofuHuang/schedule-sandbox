import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';

import { UserGroups } from '../../../both/collections/userGroups.collection';


Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) return;


  return Meteor.users.find({}, {
    fields: {
      profile: 1
    }
  })
  // return Users.collection.find({}, {
  //   fields: {
  //     profile: 1
  //   }
  // });
});

Meteor.publish('currentUser', function() {
  return Users.collection.find(this.userId, {
    fields: {
      profile: 1
    }
  })
})

Meteor.publish('groups', function() {

  return UserGroups.collection.find({});

})
