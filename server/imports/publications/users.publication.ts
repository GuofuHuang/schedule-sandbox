import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Users } from '../../../both/collections/users.collection';
import { UserGroups } from '../../../both/collections/userGroups.collection';


Meteor.publish('users', function(selector: any, options: any, keywords: string) {
  if (!this.userId) return;

  let fields = options.fields;

  let select;
  select = selector;
  if (!keywords || keywords == '') {
    // Object.assign(select, selector);
  } else {
    Object.assign(select, generateRegex(fields, keywords));
  }

  Counts.publish(this, 'users', Users.find(select).cursor, {noReady: false});

  return Users.collection.find(select, options);
});


Meteor.publish('adminUsers', function(selector: any, options: any, keywords: string) {
  if (!this.userId) return;
  let fields = options.fields;

  let select = {};
  // if keywords are none
  select['groups'] = {$in: ['wmQgkMnOYymQKH5fl']};
  if (!keywords || keywords == '') {
    Object.assign(select, selector);
  } else {
    Object.assign(select, generateRegex(fields, keywords));
  }


  Counts.publish(this, 'adminUsers', Users.find(select).cursor, {noReady: false});

  return Users.collection.find(select, options);
});

Meteor.publish('manageUsers', function(selector: any, options: any, keywords: string) {
  if (!this.userId) return;

  let fields = options.fields;

  let select;
  select = selector;
  if (!keywords || keywords == '') {
    // Object.assign(select, selector);
  } else {
    Object.assign(select, generateRegex(fields, keywords));
  }

  Counts.publish(this, 'manageUsers', Users.find(select).cursor, {noReady: false});

  return Users.collection.find(select, options);
});

Meteor.publish('currentUser', function() {
  return Users.collection.find(this.userId, {
    fields: {
      profile: 1
    }
  })
})

Meteor.publish('groups', function() {

  return UserGroups.collection.find({});

})

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
