import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';
var dateFormat = Npm.require('dateformat');
let CronJob = Npm.require('cron').CronJob;
import { SystemAlerts } from '../../../both/collections/systemAlerts.collection';
import { SystemOptions } from '../../../both/collections/systemOptions.collection';
let result = SystemOptions.collection.findOne({name: "mailOptions"});

process.env.MAIL_URL = result.value.connectionString;


let systemAlerts:any = {};

let jobs:any = [];
jobs['weeklyCopperAlert'] = weeklyCopperAlert;

let results = SystemAlerts.collection.find().fetch();
let oldTimes:string[] = [];
results.forEach((cronJob, index) => {
  let newJob;
  oldTimes[index] = cronJob.schedule;
  newJob = jobs[cronJob.name](cronJob, index);
  systemAlerts[cronJob.name] = newJob;
});

Meteor.methods({
  startCron() {
    systemAlerts = {};
    let results = SystemAlerts.collection.find().fetch();
    results.forEach((cronJob, index) => {
      console.log('start');
      let newJob = jobs[cronJob.name](cronJob, index);
      systemAlerts[cronJob.name] = newJob;
    })
  },
  stopCron() {
    let results = SystemAlerts.collection.find().fetch();
    results.forEach((cronJob, index) => {
      console.log('it is stop');
      systemAlerts[cronJob.name].stop();
    })
  }
})

export { systemAlerts };

setInterval(Meteor.bindEnvironment(() => {
  let results = SystemAlerts.collection.find().fetch();

  results.forEach((cronJob, index) => {

    if (oldTimes[index] === cronJob.schedule) {
    } else {
      console.log('not the same');
      oldTimes[index] = cronJob.schedule;
      systemAlerts[cronJob.name].stop();
      let newJob = jobs[cronJob.name](cronJob, index);
      systemAlerts[cronJob.name] = newJob;
    }
  });

}), 10000);



function weeklyCopperAlert(cronJob, index){
  console.log('1');

  let job = new CronJob({
    cronTime: cronJob.schedule,
    // cronTime: '*/5 * * * * *',
    // onTick: function() {
    //   console.log('2');
    //   console.log('ticktick');
    // },
    onTick: Meteor.bindEnvironment(() => {
      console.log('ticktik');
      cronJob = SystemAlerts.collection.findOne({_id: cronJob._id});
      let data = cronJob.data;
      let currentDate;
      if ('currentDate' in cronJob && cronJob.currentDate != '') {
        currentDate = new Date(cronJob.currentDate);
      } else {
        currentDate = new Date();
      }

      let currentTime = dateFormat(currentDate, "mm/dd/yyyy");
      let lastUpdatedTime = dateFormat(new Date(data.updatedAt), "mm/dd/yyyy");
      let lastSentTime = dateFormat(new Date(data.sentAt), "mm/dd/yyyy");

      let currentDay =  ("0" + currentDate.getDate()).slice(-2);
      let currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      let currentYear =  currentDate.getFullYear();
      let formattedDate = currentYear + "-" + currentMonth + "-" + currentDay;

      console.log('2');
      if (currentTime !== lastSentTime) {
        console.log('it is not the same');
        let request = Npm.require('request');

        request("https://www.quandl.com/api/v3/datasets/CHRIS/CME_HG1.json?start_date=" + formattedDate + "&end_date=" + formattedDate + "&api_key=Ub_eHVALYv4XxKzL_6x5",
          Meteor.bindEnvironment(function (error, response, body) {
            if (!error && response.statusCode == 200) {
              const copperObj = JSON.parse(body);
              let emailData:any = cronJob.email;

              if (copperObj.dataset.data.length > 0) {
                let copperPrice = copperObj.dataset.data[0][4];

                let priceChange = Number(copperPrice) - Number(data.value);
                let color ='black';
                if (priceChange > 0) {
                  color = 'green';
                } else if (priceChange < 0) {
                  color = 'red';
                }
                let percentage = (priceChange/Number(data.value)) * 100;
                let html = `<body>The Copper Price closed at $ ` + copperPrice + ` this week <br><br>`;
                html += `<h3>Here are the facts Jack:</h3>`;
                html += `Last Updated Cost Date: ` + lastUpdatedTime + `<br>`;
                html += `Last Updated Copper Price: $ ` + data.value + `<br>`;
                html += `Percentage Changes: <span style="color: ` + color + `">`+ percentage.toFixed(1) + `%</span></body>`;

                emailData.html = html;

                let update = {
                  $set: {
                    "data.sentAt": currentDate
                  }
                };

                SystemAlerts.collection.update({_id: cronJob._id}, update);
              } else {
                emailData.html = "Nothing to Report"
              }

              Email.send(emailData);
            }
          }))
      } else {
      }
    }),
    start: cronJob.start
  });
  return job;
}