import { Users } from './users.collection';
import { SystemTenants } from './systemTenants.collection';
import { Categories } from './categories.collection';
import { Customers } from './customers.collection';
import { CustomerMeetings } from './customerMeetings.collection';
import { UserGroups } from './userGroups.collection';

const Collections = [
  CustomerMeetings,
  Users,
  Customers,
  Categories,
  SystemTenants,
  UserGroups
];

let objCollections = {};

Collections.forEach((Collection:any) => {
  objCollections[Collection._collection._name] = Collection;
});

export { objCollections };
