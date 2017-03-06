import {MongoObservable} from "meteor-rxjs";
import { systemOption } from  '../models/systemOption.model';

export const SystemOptions = new MongoObservable.Collection<systemOption>('systemOptions');

