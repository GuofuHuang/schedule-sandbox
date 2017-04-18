import { SystemLookups } from '../../../both/collections/systemLookups.collection';
import { Categories } from '../../../both/collections/categories.collection';
import { Customers } from '../../../both/collections/customers.collection';
import { Users } from '../../../both/collections/users.collection';
import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { UserGroups } from '../../../both/collections/userGroups.collection';
import { objCollections } from '../../../both/collections';

import { Counts } from 'meteor/tmeasday:publish-counts';

import './systemOptions.publication';
import './systemTenants.publication';
import './categories.publication';
import './customerMeetings.publication';
import './userGroups.publication';
import './userPermissions.publication';
import './systemLookups.publication';


// Meteor.publish('systemLookups', function(lookupName: string, tenantId: string): Mongo.Cursor<any> {
//
//   this.onStop(() => {
//     console.log('it is stopped');
//   });
//   Counts.publish(this, 'systemLookups', SystemLookups.find({tenantId: tenantId}).cursor, {noReady: true});
//
//
//   return SystemLookups.collection.find({name: lookupName, tenantId: tenantId});
// });

Object.keys(objCollections).forEach((collectionName:any) => {
  let Collection = objCollections[collectionName];

  Meteor.publish(collectionName, function (selector: any, options: any, keywords: string) {
    let fields;
    let select;

    if ('fields' in options) {
      fields = options.fields;
      if (!keywords || keywords == '') {

      } else {
        selector = generateRegex(fields, keywords);
      }
    }

    if (collectionName == 'users') {
      console.log('selector', selector, Collection.find(selector).cursor.count());
    }

    Counts.publish(this, collectionName, Collection.find(selector).cursor, {noReady: false});
    // if (collectionName == 'userGroups') {
    //   console.log(collectionName, 'count', Collection.find(selector).cursor.count());
    // }

    this.onStop(() => {
      console.log('it is stopped');
    });

    return Collection.collection.find(selector, options);
  });
})

function generateRegex(fields: Object, keywords) {
  let obj = {
    $or: []
  };
  Object.keys(fields).forEach((key, index) => {
    obj.$or.push({
      [key]: {$regex: new RegExp(keywords, 'i')}
    })
  });
  return obj;
}
