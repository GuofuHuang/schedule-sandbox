import { SystemOptions } from '../../../both/collections/systemOptions.collection';

Meteor.publish('systemOptions', function(tenantId: string) {
  console.log('system options');
  console.log(tenantId);
  console.log(SystemOptions.collection.find({tenantId: tenantId}).fetch());
  return SystemOptions.collection.find({tenantId: tenantId});
});