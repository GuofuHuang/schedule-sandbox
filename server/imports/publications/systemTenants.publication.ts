import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { Users } from '../../../both/collections/users.collection';
import {MeteorObservable} from "meteor-rxjs";

Meteor.publish('systemTenants', function(tenantId: string) {
  let tenantIds = Users.collection.findOne(this.userId, {fields: {tenants: 1}});
  return SystemTenants.collection.find({_id: {$in: tenantIds.tenants}});
});

