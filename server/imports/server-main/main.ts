import '../cronjobs/cronjob';
import '../cronjobs/cron';
import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';


export class Main {
  start(): void {
    // let result = SystemOptions.collection.findOne({name: "mailOptions"});
    // console.log(result);
    // process.env.MAIL_URL = result.value.connectionString;

    this.initFakeData();


    // var myJobs = JobCollection('myJobQueue');
    // myJobs.allow({
    //   // Grant full permission to any authenticated user
    //   admin: function (userId, method, params) {
    //     return (userId ? true : false);
    //   }
    // });
    //
    // Meteor.publish('allJobs', function() {
    //   return myJobs.find({})
    // })
    // myJobs.startJobServer();

  }

  initFakeData(): void {
    if (Users.find({}).cursor.count() === 0) {
      const data: User[] = [{
        username: "wzcnhgf@gmail.com",
        parentTenantId: '25'
      }, {
        username: "wzcnhgf1@gmail.com",
        parentTenantId: '26'
      }, {
        username: "wzcnhgf2@gmail.com",
        parentTenantId: '27'
      }];
      data.forEach((obj: User) => {
        Users.insert(obj);
      });
    }
  }
}
