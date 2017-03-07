import { Customers } from '../../../both/collections/customers.collection';
import { miniNumbers, totalNumbers} from './index';
import { Counts } from 'meteor/tmeasday:publish-counts';
Meteor.publish('customers', function(selector: any, options: any, keywords: string) {
  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
    select.tenantId = selector.tenantId;
  }

  miniNumbers['customers'] = Customers.collection.find(select).count();
  totalNumbers['customers'] = Customers.collection.find({tenantId: selector.tenantId}).count();


  Counts.publish(this, 'customerNumber', Customers.find(select).cursor, { noReady: false });

  console.log(Customers.find(select).cursor.count());
  this.onStop(() => {
    console.log('it is stopped');
  });

  options.fields.tenantId = 1;

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
    return miniNumbers[s];
  },
  getTotalNumber(s: string): number {
    return totalNumbers[s];
  },
  test(s: any) {

    let collections = [];
    collections = [Customers];
  }
})


