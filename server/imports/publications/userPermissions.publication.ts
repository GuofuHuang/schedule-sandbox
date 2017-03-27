import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { UserPermission } from '../../../both/models/userPermission.model';

Meteor.publish('permissions', function(): Mongo.Cursor<UserPermission> {

  return UserPermissions.collection.find({}, {limit: 10});
});
