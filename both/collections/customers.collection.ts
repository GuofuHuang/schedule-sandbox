import {MongoObservable} from "meteor-rxjs";
import { Customer } from  '../models/customer.model';

export const Customers = new MongoObservable.Collection<Customer>('customers');


// Customers.find({})
//   .map(customers => {
//     console.log(customers);
//     return customers.length
//   })
//   .subscribe(todoCount => console.log(todoCount));
// console.log(Customers.find().zone());