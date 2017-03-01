import { SystemOptions } from '../../../both/collections/systemOptions.collection';

Meteor.publish('systemOptions', function() {
  return SystemOptions.collection.find({});
});