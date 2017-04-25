import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';
let Fiber = Npm.require('fibers');
Meteor.methods({
  'CRON/weeklyCopperAlert':function(){
    var CronJob = Npm.require('cron').CronJob;
    var job = new CronJob({
      cronTime: '00 00,30 16-20 * * 5',
      onTick: Meteor.bindEnvironment(function() {

        const currentDate = new Date();
        const currentDay =  ("0" + currentDate.getDate()).slice(-2);
        const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const currentYear =  currentDate.getFullYear();
        const formattedDate = currentYear + "-" + currentMonth + "-" + currentDay
        var request = Npm.require('request');


        request("https://www.quandl.com/api/v3/datasets/CHRIS/CME_HG1.json?start_date=" + formattedDate + "&end_date=" + formattedDate + "&api_key=Ub_eHVALYv4XxKzL_6x5", Meteor.bindEnvironment(function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const copperObj = JSON.parse(body);

            let emailData:any = {
              to: "jonathank@globalthesource.com",
              from: "jonathank@globalthesource.com",
              subject: "Weekly Copper Update"
            }

            if (copperObj.dataset.data.length > 0) {
              emailData.text = "Copper closed at " + copperObj.dataset.data[0][4]
            } else {
              emailData.text = "Nothing to Report"
            }

            Email.send(emailData)
          }
        }))
      }),
      start: false
    });
    job.start();
  }
});

Meteor.call('CRON/weeklyCopperAlert');
//
// const currentDate = new Date();
// const currentDay =  ("0" + currentDate.getDate()).slice(-2);
// const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
// const currentYear =  currentDate.getFullYear();
// const formattedDate = currentYear + "-" + currentMonth + "-" + currentDay
// var request = Npm.require('request');
//
// request("https://www.quandl.com/api/v3/datasets/CHRIS/CME_HG1.json?start_date=" + formattedDate + "&end_date=" + formattedDate + "&api_key=Ub_eHVALYv4XxKzL_6x5",
//   Meteor.bindEnvironment(function(error, response, body) {
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
//
//
//     if (!error && response.statusCode == 200) {
//       const copperObj = JSON.parse(body);
//
//       let emailData = {
//         to: "guofuh@globalthesource.com",
//         from: "guofuh@globalthesource.com",
//         subject: "Weekly Copper Update",
//         text: ''
//       }
//
//       if (copperObj.dataset.data.length > 0) {
//         emailData.text = "Copper closed at " + copperObj.dataset.data[0][4]
//       } else {
//         emailData.text = "Nothing to Report"
//       }
//       console.log(emailData);
//       console.log('caonimasdf');
//
//       Email.send(emailData)
//     }
//   }))