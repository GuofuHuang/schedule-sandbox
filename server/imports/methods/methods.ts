import {Meteor} from 'meteor/meteor';
import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {check, Match} from 'meteor/check';
import {Profile} from '../../../both/models/profile.model';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { UserGroups } from '../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { Users } from '../../../both/collections/users.collection';
import { CustomerMeetings } from '../../../both/collections/customerMeetings.collection';


import { Customers } from '../../../both/collections/customers.collection';
import { CustomerQuotes } from '../../../both/collections';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

const Collections = [CustomerMeetings, Customers, Users];
let objCollections = {};

Collections.forEach((Collection:any) => {
  let obj = {};
  objCollections[Collection._collection._name] = Collection;
});


Meteor.methods({
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(profile, {
      name: nonEmptyString,
      picture: nonEmptyString
    });

    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },

  updateManagesAndGroups(): void {
    // UserRoles.collection.find({}).map(userRoles => {
    //   console.log(userRoles.userID, userRoles.manages, userRoles.groups)
    //
    //   Meteor.users.update({_id: userRoles.userID},
    //     {$set: {manages: userRoles.manages, groups: userRoles.groups, }})
    // })
  },


  addChat(receiverId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(receiverId, nonEmptyString);

    if (receiverId == this.userId) throw new Meteor.Error('illegal-receiver',
      'Receiver must be different than the current logged in user');

    const chatExists = !!Chats.collection.find({
      memberIds: {$all: [this.userId, receiverId]}
    }).count();

    if (chatExists) throw new Meteor.Error('chat-exists',
      'Chat already exists');

    const chat = {
      memberIds: [this.userId, receiverId]
    };

    Chats.insert(chat);
  },
  removeChat(chatId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to remove chat');

    check(chatId, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.remove({chatId});
    Chats.remove(chatId);
  },
  addMessage(chatId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.collection.insert({
      chatId: chatId,
      senderId: this.userId,
      content: content,
      createdAt: new Date()
    });
  },

  returnUser(id) {
    return Meteor.users.findOne({_id: id});
  },

  returnPermission(id) {
    return UserPermissions.findOne({_id: id});
  },

  adminUpdateUser(updatedInfo) {
    return Meteor.users.update(
      {_id: updatedInfo.id}, {
        $set: {
          "profile.firstName": updatedInfo.firstName,
          "profile.lastName": updatedInfo.lastName,
          "username": updatedInfo.username,
          "emails.0.address": updatedInfo.email
        }
      })
  },

  addPermission(permissionInfo) {
    return UserPermissions.insert({
          "_id": generateMongoID(),
          "name": permissionInfo.name,
          "description": permissionInfo.description,
          "url": permissionInfo.url,
          "tenantId": permissionInfo.tenantId,
          "createdUserID": Meteor.userId(),
          "createdDate": new Date(),
          "updatedUserID": "",
          "updatedDate": ""
      })
  },

  adminUpdatePermission(updatedInfo) {
    return UserPermissions.update(
      {_id: updatedInfo.id}, {
        $set: {
          "name": updatedInfo.name,
          "description": updatedInfo.description,
          "url": updatedInfo.url,
          "updatedUserID": Meteor.userId(),
          "updatedDate": new Date(),
        }
      })
  },

  globalSearch(keywords) {

    return Customers.collection.find({name: keywords}).fetch();
  },
  getAllPermissions() {
    // this return all documents in Permissions collection.
    return UserPermissions.collection.find({}).fetch();
  },
  getAllPermissionsUrl() {
    // this returns only the urls in Permissions collection with its name be key of this array
    let urls = {};
    UserPermissions.collection.find({}).map(permission => {
      urls[permission.name] = permission.url;
    });
    return urls;
  },
  getUserGroupPermissions() {
    // this returns this group's permissions of that user.

    let groupId = Users.findOne(this.userId).groups[0];

    return UserGroups.collection.findOne(groupId).permissions;
  },
  userHasPermission(permissionName: string): boolean {
    // this check if the user has this permission, like accessCustomers
    let userGroupPermissions = Meteor.call('getUserGroupPermissions');
    let searchedPermission = UserPermissions.findOne({name: permissionName});
    return userGroupPermissions[searchedPermission.name];
  },

  getMenus(systemOptionName: string, tenantId: string) {
    let document = SystemOptions.findOne({name: systemOptionName, tenantId: tenantId});
    if (document) {
      let menus = document.value;
      let arr = [];
      for (let i = 0; i < menus.length; i++) {
        let result = Meteor.call('userHasPermission', menus[i].permissionName);
        if (result == "enabled") {
          arr.push({
            name: menus[i].name,
            label: menus[i].label,
            url: menus[i].url
          })
        }
      }
      return arr;
    }
  },

  getSubMenus(systemOptionName: string, menuName: string) {
    let result = [];
    let allPermissionsUrl = Meteor.call('getAllPermissionsUrl');
    let document = SystemOptions.collection.findOne({name: systemOptionName, value: {$elemMatch: {name: menuName}}});

    let menus = document.value;

    let userGroupPermissions = Meteor.call('getUserGroupPermissions');

    for (let i = 0; i < menus.length; i++) {
      let menu = menus[i];
      if (menu.name == menuName) {
        for (let j = 0; j < menu.subMenus.length; j++) {
          let subMenu = menu.subMenus[j];
          if (userGroupPermissions[subMenu.permissionName] == "enabled") {
            result.push({
              label: subMenu.label,
              permissionName: subMenu.permissionName,
              url: allPermissionsUrl[subMenu.permissionName]
            })
          }
        }
        return result;
      }
    }
  },
  getTenants() {
    return Users.collection.findOne(this.userId).groups;
  },
  getTenant(subdomain) {
    return SystemTenants.collection.find({subdomain: subdomain});
  },

  getCustomerMeetings() {

    var rawUsers = CustomerMeetings.rawCollection();
    var aggregateQuery = Meteor.wrapAsync(rawUsers.aggregate, rawUsers);
    var pipeline = [
      {$match: {status: 'Complete'}}
    ];
    var result = aggregateQuery(pipeline);

  },

  // input: master collection name, pipeline
  getAggregations(tenantId, collection: any, pipeline, columns, keywords: any) {


    pipeline.unshift({$match: {
      $or: [
        {
          tenantId: tenantId
        },
        {
          tenants: { $in: [tenantId]}
        }
      ]
    }});

    let rawCollection = objCollections[collection].rawCollection();
    let aggregateQuery = Meteor.wrapAsync(rawCollection.aggregate, rawCollection);

    let indexOfLimit = findLastIndexInArray(pipeline, "$limit");

    if (keywords) {
      let search = generateRegex(columns, keywords);
      if (indexOfLimit)
        pipeline.splice(indexOfLimit, 0, {$match: search});
      else {
        pipeline.push({$match: search});
      }
    }

    // indexOfLimit = findObjectIndexInArray(pipeline, "$limit");
    //
    // pipeline.splice(indexOfLimit, 1);

    let result = aggregateQuery(pipeline);
    return result;
  }

});



function findIndexInArray(arr: any[], objectKey) {

  let index = arr.findIndex((obj) => {
    let result = Object.keys(obj).some((key) => {
      if (key == objectKey) {
        return true
      }
    });
    if (result) {
      return true;
    }
  })
  return index;
}

function findLastIndexInArray(arr: any[], objectKey) {
  let lastIndex;
  for (let i = arr.length-1; i>= 0; i--) {
    let obj = arr[i];
    let result = Object.keys(obj).some((key) => {
      if (key == objectKey) {
        return true
      }
    });
    if (result) {
      lastIndex  = i;
      break;
    }
  }
  return lastIndex;

}

function generateRegex(columns: any[], keywords: string) {
  let obj = {
    $or: []
  };

  columns.forEach(column => {
    obj.$or.push({
      [column.prop]: {$regex: new RegExp(keywords, 'ig')}
    })
  })

  return obj;
}

function generateMongoID () {
  var mongoID = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 17; i++ ) {
    mongoID += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return mongoID;
}
