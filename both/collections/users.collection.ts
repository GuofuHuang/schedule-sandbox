import {Meteor} from 'meteor/meteor';
import {MongoObservable} from "meteor-rxjs";
import {User} from "../models/user.model";

export const Users = MongoObservable.fromExisting<User>(Meteor.users);

// Users.find({username: 'TEST ACCOUNT'})
//   .map(customers => {
//     console.log('asdf');
//     console.log(customers);
//     return customers.length
//   })
//   .subscribe(todoCount => console.log(todoCount));
console.log(Users.find({}).count());
