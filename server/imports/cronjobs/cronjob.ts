import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';
var dateFormat = Npm.require('dateformat');
let CronJob = Npm.require('cron').CronJob;
import { CronJobs } from '../../../both/collections/cronJobs.collection';

// var jobCollection = JobCollection('cronJobs');
//
// let oldTimes:string[] = [];
// let jobs:any = [];
// jobs['weeklyCopperAlert'] = function (cronJob, index) {
//   return {
//     name: cronJob.name,
//       schedule:
//     function (parser) {
//       return parser.cron(cronJob.cronTime, true)
//     }
//
//   ,
//     job: function () {
//       console.log('ticktik');
//       cronJob = CronJobs.collection.findOne({_id: cronJob._id});
//       let data = cronJob.data;
//       let currentDate = new Date('04-26-2017');
//
//       let currentTime = dateFormat(currentDate, "mm/dd/yyyy");
//       let lastUpdatedTime = dateFormat(new Date(data.updatedAt), "mm/dd/yyyy");
//       let lastSentTime = dateFormat(new Date(data.sentAt), "mm/dd/yyyy");
//
//       let currentDay = ("0" + currentDate.getDate()).slice(-2);
//       let currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
//       let currentYear = currentDate.getFullYear();
//       let formattedDate = currentYear + "-" + currentMonth + "-" + currentDay;
//
//       console.log('2');
//       if (currentTime !== lastSentTime) {
//         console.log('it is not the same');
//         let request = Npm.require('request');
//
//         request("https://www.quandl.com/api/v3/datasets/CHRIS/CME_HG1.json?start_date=" + formattedDate + "&end_date=" + formattedDate + "&api_key=Ub_eHVALYv4XxKzL_6x5",
//           function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//               const copperObj = JSON.parse(body);
//               let emailData: any = cronJob.email;
//
//               if (copperObj.dataset.data.length > 0) {
//                 let copperPrice = copperObj.dataset.data[0][4];
//
//                 let priceChange = Number(copperPrice) - Number(data.value);
//                 let color = 'black';
//                 if (priceChange > 0) {
//                   color = 'green';
//                 } else if (priceChange < 0) {
//                   color = 'red';
//                 }
//                 let percentage = (priceChange / Number(data.value)) * 100;
//                 let html = `<body>The Copper Price closed at $ ` + copperPrice + ` this week <br><br>`;
//                 html += `<h3>Here are the facts Jack:</h3>`;
//                 html += `Last Updated Cost Date: ` + lastUpdatedTime + `<br>`;
//                 html += `Last Updated Copper Price: $ ` + data.value + `<br>`;
//                 html += `Percentage Changes: <span style="color: ` + color + `">` + percentage.toFixed(1) + `%</span></body>`;
//
//                 emailData.html = html;
//
//                 let update = {
//                   $set: {
//                     "data.sentAt": currentDate
//                   }
//                 };
//
//                 // CronJobs.collection.update({_id: cronJob._id}, update);
//               } else {
//                 emailData.html = "Nothing to Report"
//               }
//
//               Email.send(emailData);
//             }
//           })
//       } else {
//       }
//       return true;
//     }
//   }
// }
//
// let results = CronJobs.collection.find().fetch();
//
// results.forEach((cronJob, index) => {
//   SyncedCron.add(jobs[cronJob.name](cronJob, index));
// })
//
//
// // SyncedCron.start();
//
//
// setInterval(Meteor.bindEnvironment(() => {
//   let results = CronJobs.collection.find().fetch();
//
//   results.forEach((cronJob, index) => {
//
//     if (oldTimes[index] === cronJob.cronTime) {
//     } else {
//       console.log('not the same');
//       oldTimes[index] = cronJob.cronTime;
//       SyncedCron.remove(cronJob.name);
//       SyncedCron.add(jobs[cronJob.name](cronJob, index));
//       // SyncedCron.start();
//
//       // cronJobs[cronJob.name].stop();
//       // let newJob = jobs[cronJob.name](cronJob, index);
//       // cronJobs[cronJob.name] = newJob;
//     }
//   });
//
// }), 10000);











let cronJobs:any = {};

let jobs:any = [];
jobs['weeklyCopperAlert'] = weeklyCopperAlert;

let results = CronJobs.collection.find().fetch();
let oldTimes:string[] = [];
results.forEach((cronJob, index) => {
  let newJob;
  oldTimes[index] = cronJob.time;
  newJob = jobs[cronJob.name](cronJob, index);
  cronJobs[cronJob.name] = newJob;
});

Meteor.methods({
  startCron() {
    cronJobs = {};
    let results = CronJobs.collection.find().fetch();
    results.forEach((cronJob, index) => {
      console.log('start');
      let newJob = jobs[cronJob.name](cronJob, index);
      cronJobs[cronJob.name] = newJob;
    })
  },
  stopCron() {
    let results = CronJobs.collection.find().fetch();
    results.forEach((cronJob, index) => {
      console.log('it is stop');
      cronJobs[cronJob.name].stop();
    })
  }
})

export { cronJobs };

setInterval(Meteor.bindEnvironment(() => {
  let results = CronJobs.collection.find().fetch();

  results.forEach((cronJob, index) => {

    if (oldTimes[index] === cronJob.time) {
    } else {
      console.log('not the same');
      oldTimes[index] = cronJob.time;
      cronJobs[cronJob.name].stop();
      let newJob = jobs[cronJob.name](cronJob, index);
      cronJobs[cronJob.name] = newJob;
    }
  });

}), 10000);



function weeklyCopperAlert(cronJob, index){
  console.log('1');
  console.log(cronJob);

  let job = new CronJob({
    cronTime: cronJob.time,
    // cronTime: '*/5 * * * * *',
    // onTick: function() {
    //   console.log('2');
    //   console.log('ticktick');
    // },
    onTick: Meteor.bindEnvironment(() => {
      console.log('ticktik');
      cronJob = CronJobs.collection.findOne({_id: cronJob._id});
      let data = cronJob.data;
      let currentDate = new Date('04-26-2017');

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

                // CronJobs.collection.update({_id: cronJob._id}, update);
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