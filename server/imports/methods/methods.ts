import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {Profile} from '../../../both/models/profile.model';
import { Random } from 'meteor/random';
import { objCollections } from '../../../both/collections';
import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import { SystemModules } from '../../../both/collections/systemModules.collection';
import { SystemTenants } from '../../../both/collections/systemTenants.collection';
import { UserGroups } from '../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../both/collections/userPermissions.collection';
import { Users } from '../../../both/collections/users.collection';
import { Categories } from '../../../both/collections/categories.collection';
import { SystemLookups } from '../../../both/collections/systemLookups.collection';
import { CustomerMeetings } from '../../../both/collections/customerMeetings.collection';

import { Customers } from '../../../both/collections/customers.collection';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

Meteor.methods({
  setPassword(userId, newPassword) {
    Accounts.setPassword(userId, newPassword, false);
    return true;
  },
  remove(collectionName, query, justOne) {
    let result = objCollections[collectionName].collection.remove(query, justOne);
    return result;
  },
  insert(collectionName, document) {
    document.createdUserId = this.userId;
    document.createdAt = new Date();
    let result = objCollections[collectionName].collection.insert(document);
    return result;
  },
  find(collectionName, query, options) {
    let result = objCollections[collectionName].collection.find(query, options).fetch();
    return result;
  },
  findOne(collectionName, query, options) {
    let result = objCollections[collectionName].collection.findOne(query, options);
    return result;
  },
  update(collectionName, query, update, options) {
    if ('$set' in update) {

    } else {
      update.$set = {updatedAt: new Date()};
    }

    update.$set.updatedAt = new Date();

    update.$set.updatedUserId = this.userId;
    return objCollections[collectionName].collection.update(query, update);
  },

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

  returnUser(id) {
    return Meteor.users.findOne({_id: id});
  },

  returnBreadcrumbs() {
    return SystemOptions.findOne({name: "breadcrumbs"})
  },


  returnGroup(id) {
    return UserGroups.findOne({_id: id});
  },

  adminUpdateGroup(updatedInfo) {
    return UserGroups.update({_id: updatedInfo.id},{
      $set :{
        name: updatedInfo.name
      }
    });
  },

  removeGroup(groupID) {
    let group = "userGroups";

    return objCollections[group].remove({_id: groupID});
  },

  removeGroupFromUserCollection(groupID) {
    return Users.update({},
      {
        $pull: {
      	   "groups":{
      	      $in: [groupID]
      	     }
           }
         },
      { multi: true }
    );
  },


  returnPermission(id) {
    return UserPermissions.findOne({_id: id});
  },

  returnPermissionNames(array) {
    let result = SystemModules.collection.find({
        _id: {
        $in: array
        }
      }
    ).fetch()
    let nameArray = []
    for (let i = 0; i < result.length; i++) {
      nameArray.push(result[i]["name"]);
    }
    return nameArray
  },


  addUser(newUser) {
    let result = Users.collection.findOne({username: newUser.username});
    if (result === undefined) {
      let userId = Accounts.createUser(newUser);
      let update = {
        $set:{
          manages: [],
          tenants: [],
          parentTenantId: newUser.parentTenantId,
          createdUserId: this.userId
        }
      }
      Users.collection.update({_id: userId}, update);
      return {result: 'success', subject: "Success", message: "Add Successfully", userId: userId};
    } else {
      return {result: "error", subject: "Error", message: 'Email already exists'};
    }
  },

  addManagesGroupsTenants(userInfo) {
    return Users.update({username: userInfo.email}, {
      $set:{
        manages: [],

        tenants: userInfo.tenants
      }
    })
  },
  returnLookup(id) {
    return SystemLookups.findOne({_id: id});


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

  insertDocument(selectedCollection, insertDocumentInfo){
    let collection = selectedCollection;
    insertDocumentInfo.createdUserId = this.userId
    insertDocumentInfo.createdAt = new Date()
    insertDocumentInfo.updatedAt = ""
    insertDocumentInfo.updatedUserId = ""
    return objCollections[collection].insert(insertDocumentInfo)
  },

  updateDocument(selectedCollection, Id, updateDocumentInfo){
    let collection = selectedCollection;
    return objCollections[collection].update({_id: Id}, { $set: updateDocumentInfo })
  },


  addPermission(permissionInfo) {
    let permission = {
          _id: generateMongoID(),
          name: permissionInfo.name,
          description: permissionInfo.description,
          url: permissionInfo.url,
          tenantId: permissionInfo.tenantId,
          createdUserId: Meteor.userId(),
          createdAt: new Date(),
          updatedUserId: "",
          updatedAt: ""
      }
      let result = Meteor.call('insert', 'userPermissions', permission);
      return permission._id;
  },

  addPermissionToModule(permissionInfo) {
    return SystemModules.update({name: permissionInfo.module},{
        $push: {
          permissions: permissionInfo.name
      }
    })
  },

  removePermissionFromModule(permissionInfo) {
    return SystemModules.update({name: permissionInfo.module},{
        $pull: {
          permissions: permissionInfo.name
      }
    },{ multi: true })
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

  adminAddGroupsPermissions(permissionName) {
    return UserGroups.update({},
      {
        $push: {
           groupPermissions: {
             name: permissionName,
             value: ""
           }
         }
        },
	    { multi: true }
    )
  },

  adminRemoveGroupsPermissions(permissionName) {
    return UserGroups.update({},
      {
        $pull: {
           groupPermissions: {name: permissionName}
         }
        },
	    { multi: true }
    )
  },

  adminRemovePermissions(id) {
    return UserPermissions.remove({_id: id})
  },

  deleteSystemLookups(deleteID) {
    return SystemLookups.remove({_id: deleteID})
  },

  globalSearch(keywords) {

    return Customers.collection.find({name: keywords}).fetch();
  },

  getTenantPermissions(parentTenantId) {
    let pipeline = [
      {
        "$match" : {
          "_id" : parentTenantId
        }
      },
      {
        "$project" : {
          "modules" : 1.0
        }
      },
      {
        "$unwind" : "$modules"
      },
      {
        "$lookup" : {
          "from" : "systemModules",
          "localField" : "modules",
          "foreignField" : "name",
          "as" : "result"
        }
      },
      {
        "$unwind" : "$result"
      },
      {
        "$unwind" : "$result.permissions"
      },
      {
        "$group" : {
          "_id" : null,
          "permissions" : {
            "$addToSet" : "$result.permissions"
          }
        }
      },
      {
        "$unwind" : "$permissions"
      },
      {
        "$lookup" : {
          "from" : "userPermissions",
          "localField" : "permissions",
          "foreignField" : "name",
          "as" : "result"
        }
      },
      {
        "$unwind" : "$result"
      },
      {
        "$project" : {
          "_id" : "$result._id",
          "name" : "$result.name",
          "description" : "$result.description",
          "tenantId" : "$result.tenantId"
        }
      }
    ];

    return Meteor.call('aggregate', 'systemTenants', pipeline);
  },

  getAllPermissionsUrl() {
    // this returns only the urls in Permissions collection with its name be key of this array
    let urls = {};
    UserPermissions.collection.find({}).map(permission => {
      urls[permission.name] = permission.url;
    });
    return urls;
  },
  getUserGroupPermissions(tenantId) {
    // this returns this group's permissions of that user.
    let tenants = Users.findOne(this.userId).tenants;
    let tenant:any = tenants.find((tenant:any={}) => {
      return tenant._id == tenantId;
    });
    let groupId = tenant.groups[1];
    // return UserGroups.collection.findOne(groupId).permissions;
    let groupPermissions = UserGroups.collection.findOne(groupId).groupPermissions;

    let result:any = {};
    let length = groupPermissions.length;
    for (let i = 0; i < length; i++) {
      let permission = groupPermissions[i];
      result[permission.name] = permission.value;
    }
    return result;
  },
  userHasPermission(tenantId, permissionName: string): boolean {
    // this check if the user has this permission, like accessCustomers
    let userGroupPermissions = Meteor.call('getUserGroupPermissions', tenantId);
    return userGroupPermissions[permissionName];
  },

  addGroup(group) {
    let number = Random.id();
    let documentID = generateMongoID ();
    let doc = {
      _id: Random.id(),
      name: group.name,
      groupPermissions: group.groupPermissions,
      parentTenantId: group.parentTenantId,
      createdUserId: this.userId,
      createdAt: new Date(),

    }
    let result = Meteor.call('insert', 'userGroups', doc);

    return doc._id;
  },

  getMenus(systemOptionName: string, tenantId: string) {
    let document = SystemOptions.findOne({name: systemOptionName, tenantId: tenantId});
    if (document) {
      let menus = document.value;
      let arr = [];
      for (let i = 0; i < menus.length; i++) {
        let result = Meteor.call('userHasPermission', tenantId, menus[i].permissionName);
        let allPermissionsUrl = Meteor.call('getAllPermissionsUrl');

        if (result == "enabled") {
          arr.push({
            name: menus[i].name,
            label: menus[i].label,
            url: allPermissionsUrl[menus[i].permissionName]
            // url: menus[i].url
          })
        }
      }
      return arr;
    }
  },

  updateField(collectionName, selector, update) {
     const Collections = [Categories, Customers, Users, UserGroups];
     let arr = {};

     Collections.forEach((Collection:any) => {
       let obj = {};
       arr[Collection._collection._name] = Collection;
     });

     let Collection = arr[collectionName];
       Collection.collection.update(selector, update);
   },

  getSubMenus(tenantId, systemOptionName: string, menuName: string) {
    let result = [];
    let allPermissionsUrl = Meteor.call('getAllPermissionsUrl');
    let document = SystemOptions.collection.findOne({name: systemOptionName});

    if (document) {
      let menus = document.value;
      let userGroupPermissions = Meteor.call('getUserGroupPermissions', tenantId);

      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (menu.name == menuName) {
          for (let j = 0; j < menu.subMenus.length; j++) {
            let subMenu = menu.subMenus[j];
            if (userGroupPermissions[subMenu.permissionName] === 'enabled') {
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
  },
  getTenants() {
    return Users.collection.findOne(this.userId).tenants;
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


  aggregate(collectionName, pipeline) {
    let rawCollection = objCollections[collectionName].rawCollection();
    let aggregateQuery = Meteor.wrapAsync(rawCollection.aggregate, rawCollection);

    let result = aggregateQuery(pipeline);

    return result;
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
  },

  softDeleteDocument(selectedCollection, documentId) {
    let collection = selectedCollection;

    return  objCollections[collection].update({_id: documentId},
      {	$set:{"removed": true}
    })
  },

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
