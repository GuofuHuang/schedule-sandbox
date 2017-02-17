import { MongoObservable } from 'meteor-rxjs';

export const Parties = new MongoObservable.Collection('parties');

Parties.find().cursor.map(parties => {
})