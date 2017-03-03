import {Meteor} from 'meteor/meteor';
import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {check, Match} from 'meteor/check';
import {Profile} from '../../../both/models/profile.model';

import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import { UserGroups } from '../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { Users } from '../../../both/collections/users.collection';

import { Customers } from '../../../both/collections/customers.collection';
import { CustomerQuotes } from '../../../both/collections';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
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

  getMenus(systemOptionName: string) {

    let document = SystemOptions.findOne({name: systemOptionName});
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

    // foreach can't break it to return value. for loop can break it and return value.
    //
    // menus.forEach(menu => {
    //   let result = Meteor.call('userHasPermission', menu.permissionName);
    //   if (result) {
    //     return result;
    //   }
    // });
    // return document.menus;
  },

  getSubMenus(systemOptionName: string, menuName: string) {
    let result = [];
    let allPermissionsUrl = Meteor.call('getAllPermissionsUrl');
    let document = SystemOptions.collection.findOne({name: systemOptionName, value: {$elemMatch: {name: menuName}}});

    let menus = document.value;

    let userGroupPermissions = Meteor.call('getUserGroupPermissions');

    // let Users1 = new Mongo.Collection('emojis');
    // console.log(Users1.find({}).fetch());
    // console.log('caonima');

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

  getTenantIds() {
    return Users.collection.findOne(this.userId);
  },

  getTenants() {

    return Users.collection.findOne(this.userId).groups;
  }

});