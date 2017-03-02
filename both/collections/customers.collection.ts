import {MongoObservable} from "meteor-rxjs";
import { Customer } from  '../models/customer.model';

export const Customers = new MongoObservable.Collection<Customer>('customers');