import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Customers } from '../../../both/collections/customers.collection';
import {numbers} from './index';
let t = 0;
Meteor.publish('customers', function(selector: any, options: any, keywords: string) {


  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
  }

  numbers['customers'] = Customers.collection.find(select).count();

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
  getMiniMongoCount(s: string): number {

    return 0;
  }
})


