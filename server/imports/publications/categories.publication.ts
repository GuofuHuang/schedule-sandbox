import { Categories } from '../../../both/collections/categories.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

Meteor.publish('categories', function(selector: any, options: any, keywords: string) {
  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
  }
  select.tenantId = selector.tenantId;

  Counts.publish(this, 'categories', Categories.find(select).cursor, {noReady: false});

  this.onStop(() => {
    console.log('it is stopped');
  });

  options.fields.tenantId = 1;

  return Categories.collection.find(select, options);
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