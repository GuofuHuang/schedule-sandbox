import { SystemLookups } from '../../../both/collections/systemLookups.collection';
import { Categories } from '../../../both/collections/categories.collection';
import { Customers } from '../../../both/collections/customers.collection';
import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { Users } from '../../../both/collections/users.collection';
import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { UserGroups } from '../../../both/collections/userGroups.collection';


import { Counts } from 'meteor/tmeasday:publish-counts';

import './systemOptions.publication';
import './systemTenants.publication';
import './categories.publication';
import './customerMeetings.publication';
import './userGroups.publication';
import './userPermissions.publication';
import './systemLookups.publication';


Meteor.publish('systemLookups', function(lookupName: string, tenantId: string): Mongo.Cursor<any> {

  this.onStop(() => {
    console.log('it is stopped');
  });
  Counts.publish(this, 'systemLookups', SystemLookups.find({tenantId: tenantId}).cursor, {noReady: true});


  return SystemLookups.collection.find({name: lookupName, tenantId: tenantId});
});

const Collections = [Categories, Customers, Users, SystemTenants, UserGroups];
let arr = {};

Collections.forEach((Collection:any) => {
  let obj = {};
  arr[Collection._collection._name] = Collection;
});

Object.keys(arr).forEach((collectionName:any) => {
  let Collection = arr[collectionName];

  Meteor.publish(collectionName, function (selector: any, options: any, keywords: string) {

    let fields = options.fields;
    let select;

    if (!keywords || keywords == '') {
      select = selector;
    } else {
      select = generateRegex(fields, keywords);
    }


    Counts.publish(this, collectionName, Collection.find(select).cursor, {noReady: false});

    this.onStop(() => {
      console.log('it is stopped');
    });

    return Collection.collection.find(select, options);
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
