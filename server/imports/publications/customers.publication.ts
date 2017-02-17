import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Customers } from '../../../both/collections/customers.collection';
import { Customer } from '../../../both/models/customer.model';

Meteor.publish('customers', function(options: Object, test: string): Mongo.Cursor<Customer> {
  console.log(test);


  return Customers.collection.find({}, options);
});
