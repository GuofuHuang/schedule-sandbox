import '../cronjobs/cronjob';
import '../cronjobs/cron';
import { SystemOptions } from '../../../both/collections/systemOptions.collection';


export class Main {
  start(): void {


    let result = SystemOptions.collection.findOne({name: "mailOptions"});

    process.env.MAIL_URL = result.value.connectionString;


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
}
