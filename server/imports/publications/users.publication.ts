import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from "meteor-rxjs";

import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
import { UserRoles } from '../../../both/collections/userRoles.collection';
import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import { Groups } from '../../../both/collections/groups.collection';
import { Permissions } from '../../../both/collections/permissions.collection';

Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) return;

  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});

Meteor.publish('groups', function() {

  return Groups.collection.find({});
})
