import { MongoObservable } from 'meteor-rxjs';

export const Products = new MongoObservable.Collection<any>('products');
