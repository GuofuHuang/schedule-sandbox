import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {Users} from '../../../both/collections/users.collection';
import {UserPermissions} from '../../../both/collections/userPermissions.collection';
import {Products} from '../../../both/collections/products.collection';
import {SystemOptions} from '../../../both/collections/systemOptions.collection';
import {Accounts} from 'meteor/accounts-base';
import '../cronjobs/cronjob';
// import { UserRoles } from '../../../both/collections/userRoles.collection';

import { Mongo } from 'meteor/mongo';
import {MeteorObservable} from "meteor-rxjs";

export class Main {
  start(): void {

    process.env.MAIL_URL = "smtp://postmaster@globalthesource.com:2b2c7af36c40adb0ffc4f2b4c2b9e3c5@smtp.mailgun.org:587";
    // console.log(process.env);

    // SystemOptions.collection.update({}, {$set: {
    //   tenantId: '4sdRt09goRP98e456'
    // }}, { multi: true}, (err, res) => {
    //   console.log(res, err);
    // });

    // Users.collection.update({}, {$pop: {
    //   tenantId: 1
    // }}, { multi: true})
  }
}
