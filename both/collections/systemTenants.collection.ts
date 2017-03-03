import {MongoObservable} from "meteor-rxjs";

export const SystemTenants = new MongoObservable.Collection<any>("systemTenants");
