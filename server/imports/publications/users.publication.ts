import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
import { UserRoles } from '../../../both/collections/userRoles.collection';
import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import { Groups } from '../../../both/collections/groups.collection';
import { Permissions } from '../../../both/collections/permissions.collection';

Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) return;

  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});

Meteor.methods({
  getAllPermissions() {
    // this return all documents in Permissions collection.
    return Permissions.collection.find({}).fetch();
  },
  getAllPermissionsUrl() {
    // this returns only the urls in Permissions collection with its name be key of this array
    let urls = {};
    Permissions.collection.find({}).map(permission => {
      urls[permission.name] = permission.url;
    });
    return urls;
  },
  getUserGroupPermissions() {
    // this returns this group's permissions of that user.
    let groupId = UserRoles.collection.find({userId: this.userId}).fetch()[0].groups[0];
    return Groups.collection.find(groupId).fetch()[0].permissions;
  },
  userHasPermission(permissionName: string): boolean {
    // this check if the user has this permission, like accessCustomers
    let userGroupPermissions = Meteor.call('getUserGroupPermissions');
    let searchedPermission = Permissions.collection.find({name: permissionName}).fetch()[0];
    return userGroupPermissions[searchedPermission.name];
  },

  getMenus(systemOptionName: string) {

    let document = SystemOptions.collection.find({name: systemOptionName}).fetch()[0];
    let menus = document.menus;
    let arr = [];
    for (let i = 0; i < menus.length; i++) {
      let result = Meteor.call('userHasPermission', document.menus[i].permissionName);
      console.log(result);
      if (result == "enabled") {
        arr.push({
          name: document.menus[i].name,
          label: document.menus[i].label,
          url: document.menus[i].url
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
    let document = SystemOptions.collection.find({name: systemOptionName, menus: {$elemMatch: {name: menuName}}}).fetch()[0];

    let menus = document.menus;

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
  }
})