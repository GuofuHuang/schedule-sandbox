import { Customers } from '../../../both/collections/customers.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';









  //
  //
  // Meteor.publish('customers', function(selector: any, options: any, keywords: string) {
  //   let fields = options.fields;
  //
  //   let select;
  //   if (!keywords || keywords == '') {
  //     select = selector;
  //   } else {
  //     select = generateRegex(fields, keywords);
  //   }
  //   select.tenantId = selector.tenantId;
  //
  //   Counts.publish(this, 'customers', Customers.find(select).cursor, {noReady: false});
  //
  //   this.onStop(() => {
  //     console.log('it is stopped');
  //   });
  //
  //   options.fields.tenantId = 1;
  //
  //   return Customers.collection.find(select, options);
  // });

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


