import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { miniNumbers, totalNumbers} from './index';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';

import { UserGroups } from '../../../both/collections/userGroups.collection';


Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) return;


  return Meteor.users.find({}, {
    fields: {
      profile: 1,
      username: 1,
      emails: 1,
      services: 1,
      groups: 1,
      manages: 1,
      tenants: 1,
    }
  })
  // return Users.collection.find({}, {
  //   fields: {
  //     profile: 1
  //   }
  // });
});

Meteor.publish('currentUser', function() {
  return Users.collection.find(this.userId, {
    fields: {
      profile: 1,
      username: 1,
      emails: 1,
      services: 1,
      groups: 1,
      manages: 1,
      tenants: 1,
    }
  })
})

Meteor.publish('groups', function() {

  return UserGroups.collection.find({});

})

Meteor.publish('adminUsers', function(selector: any, options: any, keywords: string) {
  let fields = options.fields;

  let select;
  if (!keywords || keywords == '') {
    select = selector;
  } else {
    select = generateRegex(fields, keywords);
    select.tenantId = selector.tenantId;
  }

  miniNumbers['users'] = Users.collection.find(select).count();
  totalNumbers['users'] = Users.collection.find({tenantId: selector.tenantId}).count();

  console.log(Users.find(select).cursor.count());
  this.onStop(() => {
    console.log('it is stopped');
  });

  options.fields.tenantId = 1;

  return Users.collection.find(select, options);
});

function generateRegex(fields: Object, keywords) {
  let obj = {
    $or: []
  };
  Object.keys(fields).forEach((key, index) => {
    obj.$or.push({
      [key]: {$regex: new RegExp(keywords, 'i')}
    })

  });
  return obj;
}
