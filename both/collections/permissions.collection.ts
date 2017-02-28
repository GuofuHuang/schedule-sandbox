import { MongoObservable } from 'meteor-rxjs';

export const Permissions = new MongoObservable.Collection<any>('permissions');

Permissions.deny({
  insert() { return true },
  update() { return true },
  remove() { return true }
});
