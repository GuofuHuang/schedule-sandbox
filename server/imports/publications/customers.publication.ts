import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Customers } from '../../../both/collections/customers.collection';
import { Customer } from '../../../both/models/customer.model';

Meteor.publish('customers', function(selector: any, options: Object, keywords: any) {
  return Customers.find(selector, options);
});