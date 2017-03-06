import { MongoObservable } from 'meteor-rxjs';
import { SystemTenant } from  '../models/systemTenant.model';

export const SystemTenants = new MongoObservable.Collection<SystemTenant>('systemTenants');