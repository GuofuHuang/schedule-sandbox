import { MongoObservable } from 'meteor-rxjs';

export const UserPermissions = new MongoObservable.Collection<any>("userPermissions");

UserPermissions.deny({
  insert() { return true },
  update() { return true },
  remove() { return true }
});
