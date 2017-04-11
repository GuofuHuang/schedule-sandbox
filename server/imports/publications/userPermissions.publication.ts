import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { UserPermission } from '../../../both/models/userPermission.model';

Meteor.publish('userPermissions', function(): Mongo.Cursor<UserPermission> {
  Counts.publish(this, 'userPermissions', UserPermissions.find({}).cursor, {noReady: false});

  return UserPermissions.collection.find({}, {limit: 10});
});
