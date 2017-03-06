import {MongoObservable} from "meteor-rxjs";
import { CustomerContract } from  '../models/customerContract.model';

export const CustomerContracts = new MongoObservable.Collection<CustomerContract>('customerContracts');