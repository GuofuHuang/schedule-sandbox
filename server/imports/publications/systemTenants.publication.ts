import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { Users } from '../../../both/collections/users.collection';
import {MeteorObservable} from "meteor-rxjs";

Meteor.publish('systemTenants', function(tenantId: string) {


    let tenantIds = Users.collection.findOne(this.userId).groups;
    console.log(tenantIds);
    return SystemTenants.collection.find({tenantid: tenantId});
});

function test() {
  console.log('asdf');
  console.log(Users.collection.findOne(this.userId));
}