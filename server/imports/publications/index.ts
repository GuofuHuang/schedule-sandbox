import { SystemLookups, Categories } from '../../../both/collections';
import {MongoObservable} from "meteor-rxjs";

Meteor.publish('systemLookups', function(collectionName: string, test: string): Mongo.Cursor<any> {
  return SystemLookups.collection.find({collection: collectionName});
});

Meteor.publish('categories', function(options: Object): Mongo.Cursor<any> {

  return Categories.collection.find({}, options);
});
