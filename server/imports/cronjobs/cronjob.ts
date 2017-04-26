import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';

let CronJob = Npm.require('cron').CronJob;
import { CronJobs } from '../../../both/collections/cronJobs.collection';

let cronJobs:any = [];

let funcs:any = {};
funcs['weeklyCopperAlert'] = weeklyCopperAlert;

let results = CronJobs.collection.find().fetch();
results.forEach(cronJob => {
  let newJob;
  newJob = funcs[cronJob.name](cronJob);
  let obj = {
    name: cronJob.name,
    job: newJob
  };
  cronJobs.push(obj);
});

export { cronJobs };

function weeklyCopperAlert(cronJob){
  return new CronJob({
    cronTime: cronJob.cronTime,
    // cronTime: '00 00,30 16-20 * * 5',
    onTick: Meteor.bindEnvironment(function() {
      const currentDate = new Date();
      const currentDay =  ("0" + currentDate.getDate()).slice(-2);
      const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const currentYear =  currentDate.getFullYear();
      const formattedDate = currentYear + "-" + currentMonth + "-" + currentDay;
      let request = Npm.require('request');

      request("https://www.quandl.com/api/v3/datasets/CHRIS/CME_HG1.json?start_date=" + formattedDate + "&end_date=" + formattedDate + "&api_key=Ub_eHVALYv4XxKzL_6x5",
        Meteor.bindEnvironment(function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const copperObj = JSON.parse(body);
          let emailData:any = cronJob.email;

          if (copperObj.dataset.data.length > 0) {
            emailData.text = "Copper closed at " + copperObj.dataset.data[0][4]
          } else {
            emailData.text = "Nothing to Report"
          }
          Email.send(emailData)
        }
      }))
    }),
    start: cronJob.start
  });
}
