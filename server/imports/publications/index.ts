import { objCollections } from '../../../both/collections';


import { Counts } from 'meteor/tmeasday:publish-counts';

import './systemOptions.publication';
import './systemTenants.publication';
import './categories.publication';
import './customerMeetings.publication';
import './userGroups.publication';
import './users.publication';
import './userPermissions.publication';
import './systemLookups.publication';
import './customers.publication';
import './customerInvoices.publication';
import './warehouses.publication';

Object.keys(objCollections).forEach((collectionName:any) => {
  let Collection = objCollections[collectionName];

  Meteor.publish(collectionName, function (selector: any, options: any, keywords: string) {
    let fields;
    let select;

    if (options) {
      if ('fields' in options) {
        fields = options.fields;
        if (!keywords || keywords == '') {

        } else {
          selector = generateRegex(fields, keywords);
        }
      }
    }

    if (collectionName == 'warehouseBins') {
      console.log('this is products');
      // let pp = Collection.collection.find(selector).fetch();
      // console.log(pp.length);
      // console.log('selector', selector, options, keywords );
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
