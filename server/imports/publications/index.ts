import { SystemLookups } from '../../../both/collections';
import {MongoObservable} from "meteor-rxjs";
import './systemOptions.publication';
import './systemTenants.publication';
import './categories.publication';

Meteor.publish('systemLookups', function(lookupName: string, test: string): Mongo.Cursor<any> {
  return SystemLookups.collection.find({name: lookupName});
});


export let miniNumbers = []; // total number from the mini mongo.
export let totalNumbers = [];// total number results from the mongo database
