import {MongoObservable} from "meteor-rxjs";

export const SystemJS = new MongoObservable.Collection<any>('system.js');

SystemJS.insert({
  _id: "c2",
  value: function() {
    console.log('121212');
  }
})