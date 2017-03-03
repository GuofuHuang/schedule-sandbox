import { MongoObservable } from 'meteor-rxjs';
import { UserPermission } from  '../models/userPermission.model';

export const UserPermissions = new MongoObservable.Collection<UserPermission>('userPermissions');

UserPermissions.deny({
  insert() { return true },
  update() { return true },
  remove() { return true }
});
