import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { SystemLookups } from '../../../both/collections/systemLookups.collection';
import { SystemLookup } from '../../../both/models/systemLookup.model';

Meteor.publish('one_systemLookups', function(lookupName: string, tenantId: string): Mongo.Cursor<any> {

  this.onStop(() => {
    console.log('it is stopped');
  });
  if (lookupName == 'userGroups') {
    console.log(lookupName, tenantId);
  }

  return SystemLookups.collection.find({name: lookupName, tenantId: tenantId});
});

// Meteor.publish('systemLookups', function(tenantId: string): Mongo.Cursor<any> {
//
//   this.onStop(() => {
//     console.log('it is stopped');
//   });
//
//   return SystemLookups.collection.find({tenantId: tenantId});
// });
Meteor.publish('adminsystemLookup', function(): Mongo.Cursor<any> {
  Counts.publish(this, 'adminsystemLookup', SystemLookups.find({}).cursor, {noReady: false});
  return SystemLookups.collection.find({}, {limit: 10});
});
