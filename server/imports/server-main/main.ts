import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {Users} from '../../../both/collections/users.collection';
import {UserPermissions} from '../../../both/collections/userPermissions.collection';
import {Products} from '../../../both/collections/products.collection';
import {SystemOptions} from '../../../both/collections/systemOptions.collection';
import {Accounts} from 'meteor/accounts-base';
// import { UserRoles } from '../../../both/collections/userRoles.collection';

import { Mongo } from 'meteor/mongo';

export class Main {
  start(): void {
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
