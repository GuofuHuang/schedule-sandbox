import {MongoObservable} from "meteor-rxjs";

export const Groups = new MongoObservable.Collection<any>('groups');
