import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { SystemLookups } from '../../../both/collections/index';
import { SystemLookup } from '../../../both/models/systemLookup.model';

Meteor.publish('systemLookup', function(): Mongo.Cursor<SystemLookup> {
  Counts.publish(this, 'systemLookup', SystemLookups.find({}).cursor, {noReady: false});
  return SystemLookups.collection.find({}, {limit: 10});
});