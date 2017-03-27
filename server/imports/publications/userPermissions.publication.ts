import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { UserPermission } from '../../../both/models/userPermission.model';

Meteor.publish('permissions', function(): Mongo.Cursor<UserPermission> {
  Counts.publish(this, 'permissions', UserPermissions.find({}).cursor, {noReady: false});

  return UserPermissions.collection.find({}, {limit: 10});
});
