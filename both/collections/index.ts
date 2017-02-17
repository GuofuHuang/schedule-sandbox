import {MongoObservable} from "meteor-rxjs";

export const SystemLookups = new MongoObservable.Collection<any>('systemLookups');

export const Categories = new MongoObservable.Collection<any>('categories');