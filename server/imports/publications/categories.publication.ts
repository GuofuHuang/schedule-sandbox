import { Categories } from '../../../both/collections/categories.collection';
import { miniNumbers, totalNumbers} from './index';

Meteor.publish('categories', function(selector: any, options: any, keywords: string) {
  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
    select.tenantId = selector.tenantId;
  }

  miniNumbers['categories'] = Categories.collection.find(select).count();
  totalNumbers['categories'] = Categories.collection.find({tenantId: selector.tenantId}).count();

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