import { SystemLookups, Categories } from '../../../both/collections';
import {MongoObservable} from "meteor-rxjs";

Meteor.publish('systemLookups', function(lookupName: string, test: string): Mongo.Cursor<any> {
  return SystemLookups.collection.find({name: lookupName});
});

Meteor.publish('categories', function(options: Object): Mongo.Cursor<any> {

  return Categories.collection.find({}, options);
});
