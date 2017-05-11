import { Meteor } from 'meteor/meteor';

import { Profile } from '../models/profile.model';

export interface User extends Meteor.User {
  profile?: Profile;
  groups?: {}[];
  tenants?: any[];
  removed?: boolean;
  parentTenantId?: string;
  updatedAt?: Date;
  // createdAt?: Date;
  manages?: string[];
  username?: string;
  creaatedUserId?: string;
}
