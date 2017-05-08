import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

Meteor.publish('parentTenant', function(subdomain) {
  return SystemTenants.collection.find({subdomain: subdomain});
});

Meteor.publish('addTenant', function(selector: any, options: any, keywords: string) {
  let fields;
  let select;
  console.log('asdf');

  if (options) {
    if ('fields' in options) {
      fields = options.fields;
      if (!keywords || keywords == '') {

      } else {
        selector = generateRegex(fields, keywords);
      }
    }
  }

  console.log('caoniasdfasfasdfasfasdfasfasdfasfasdf');

  Counts.publish(this, 'addTenant', SystemTenants.find(selector).cursor, {noReady: false});
  // if (collectionName == 'userGroups') {
  //   console.log(collectionName, 'count', Collection.find(selector).cursor.count());
  // }

  this.onStop(() => {
    console.log('it is stopped afasdfasdf');
  });

  return SystemTenants.collection.find(selector, options);
});

// Meteor.publish('childTenants', function(tenantId) {
//   return SystemTenants.collection.find({parentTenantId: tenantId});
// });

// Meteor.publish('updateSystemTenants', function(tenantId) {
//   return SystemTenants.collection.find({$or: [{parentTenantId: tenantId}, {_id: tenantId}]});
// });

// Meteor.publish('all_systemTenants', function(tenantId) {
//   return SystemTenants.collection.find({$or: [{parentTenantId: tenantId}, {_id: tenantId}]});
// });
//
// Meteor.publish('updateSystemTenants', function(selector: any, options: any, keywords: string) {
//   if (!this.userId) return;
//
//   let fields = options.fields;
//
//   let select;
//   select = selector;
//   if (!keywords || keywords == '') {
//     // Object.assign(select, selector);
//   } else {
//     Object.assign(select, generateRegex(fields, keywords));
//   }
//
//   Counts.publish(this, 'updateSystemTenants', SystemTenants.find(select).cursor, {noReady: false});
//   return SystemTenants.collection.find({});
// })

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
