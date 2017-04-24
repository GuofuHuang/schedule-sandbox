import {MongoObservable} from "meteor-rxjs";

export const CronJobs = new MongoObservable.Collection<any>('cronJobs');

function test() {
  console.log(test);
}
// p = new Function('chatr', )

// CronJobs.insert({
//   _id: "guofu12",
//   value:
// })
