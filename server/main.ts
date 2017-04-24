import { Main } from './imports/server-main/main';
import './imports/methods/methods';
import './imports/publications/chats.publication';
import './imports/publications/messages.publication';
import './imports/publications/users.publication';
import './imports/publications/customers.publication';
import './imports/publications/customerInvoices.publication';
import './imports/publications';
import { CronJobs } from '../both/collections/cronJobs.collection';
import { SystemJS } from '../both/collections/systemJS.collection';
// import './imports/api/sms';

const mainInstance = new Main();
mainInstance.start();


// let job = SystemJS.collection.find({_id: 'caonima1212'}).fetch();
//
// console.log(job[0]);
// let p = "(" + job[0].value.code + ")";
//
// let tt = eval(p);
//
// console.log(tt);

// tt();

//
// function test() {
//   let p = Chats.collection.find().fetch();
//   console.log(p);
// }
//
// test();
//
let job = CronJobs.collection.find().fetch();
let func = job[2].value;
console.log(job[2]);
let p = eval("(" + func.code + ")" );
console.log(p);
p();
// let p = new Function('CronJobs', func.value);
// p(CronJobs);



// let p = new Function('Chats', 'console.log(Chats)');
// p(Chats);

// eval(job[0].job);

// let CronJob = Npm.require('cron').CronJob;
// let cronJobs = [];

// try {
//   let job = new CronJob({
//     cronTime: '* * * * * *',
//     onTick: function () {
//       console.log("this is guofu huang");
//     },
//     start: false,
//     timeZone: 'America/Chicago'
//   })
//
//   job.start();
// }
//
// catch (ex) {
//   console.log('cron pattern not  valid');
// }
//
// // let job = new CronJob('* * * * * *', function() {
// //   console.log('You will see this message every second');
// // }, null, true, 'America/Los_Angeles');
// //
// // cronJobs.push(job);
// //
// export { cronJobs };