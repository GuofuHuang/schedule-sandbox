import {MongoObservable} from "meteor-rxjs";

export const SystemLookups = new MongoObservable.Collection<any>('systemLookups');

export const CustomerQuotes = new MongoObservable.Collection<any>('customerQuotes');
