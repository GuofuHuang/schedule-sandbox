import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { CustomerInvoices } from '../../../both/collections/customerInvoices.collection';
import { CustomerInvoice } from '../../../both/models/customerInvoice.model';

Meteor.publish('customerInvoices', function(): Mongo.Cursor<CustomerInvoice> {

  return CustomerInvoices.collection.find({}, {limit: 10});
});
