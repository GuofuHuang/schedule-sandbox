import { SystemLookups } from '../../../both/collections';
import { Categories } from '../../../both/collections/categories.collection';
import {MongoObservable} from "meteor-rxjs";
import './systemOptions.publication';
import './systemTenants.publication';
Meteor.publish('systemLookups', function(lookupName: string, test: string): Mongo.Cursor<any> {
  return SystemLookups.collection.find({name: lookupName});
});

Meteor.publish('categories', function(selector: any, options: any, keywords: string) {

  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
  }

  numbers['categories'] = Categories.collection.find(select).count();
  totalNumbers['categories'] = Categories.collection.find().count();

  return Categories.collection.find(select, options);
});



export let numbers = [];
export let totalNumbers = [];

export let miniMongoCounts = [];



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