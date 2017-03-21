import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { SystemLookups } from '../../../both/collections/index';
import { SystemLookup } from '../../../both/models/systemLookup.model';

Meteor.publish('systemLookups', function(): Mongo.Cursor<SystemLookup> {
  return SystemLookups.collection.find({});
});
