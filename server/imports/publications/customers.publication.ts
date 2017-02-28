import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Customers } from '../../../both/collections/customers.collection';
import { numbers, totalNumbers} from './index';

Meteor.publish('customers', function(selector: any, options: any, keywords: string) {


  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
  }

  // Counts.publish(this, 'customers', Customers.collection.find(select), {});

  numbers['customers'] = Customers.collection.find(select).count();
  totalNumbers['customers'] = Customers.collection.find().count();

  this.onStop(() => {
    console.log('it is stopped');
  })

  return Customers.collection.find(select, options);
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

Meteor.methods({
  getNumber(s: string): number {
    return numbers[s];
  },
  getTotalNumber(s: string): number {
    return totalNumbers[s];
  }
})


