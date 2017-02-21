import { Meteor } from 'meteor/meteor';

import { Customers } from '../../../both/collections/customers.collection';

Meteor.publish('customers', function(selector: any, options: any, keywords: string) {

  let fields = options.fields;

  let select;
  if (!keywords) {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
  }

  return Customers.find(select, options);
});

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


