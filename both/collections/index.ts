import { Users } from './users.collection';
import { SystemTenants } from './systemTenants.collection';
import { Categories } from './categories.collection';
import { Customers } from './customers.collection';
import { CustomerMeetings } from './customerMeetings.collection';
import { UserGroups } from './userGroups.collection';
import { UserPermissions } from './userPermissions.collection';
import { SystemLookups } from './systemLookups.collection';
import { SystemOptions } from './systemOptions.collection';
import { SystemAlerts } from './systemAlerts.collection';
import { SystemModules } from './systemModules.collection';
import { Products } from './products.collection';
import { Warehouses } from './warehouses.collection';
import { WarehouseBins } from './warehouseBins.collection';
import { CustomerOrders } from './customerOrders.collection';

const Collections = [
  CustomerMeetings,
  Users,
  Customers,
  Categories,
  SystemTenants,
  UserGroups,
  UserPermissions,
  SystemLookups,
  SystemOptions,
  SystemAlerts,
  SystemModules,
  Products,
  Warehouses,
  WarehouseBins,
  CustomerOrders
];

let objCollections = {};

Collections.forEach((Collection:any) => {
  objCollections[Collection._collection._name] = Collection;
});

export { objCollections };
