import { Main } from './imports/server-main/main';
import './imports/methods/methods';
import './imports/publications/users.publication';
import './imports/publications/customers.publication';
import './imports/publications/customerInvoices.publication';
import './imports/publications';
import { CronJobs } from '../both/collections/cronJobs.collection';
import { SystemJS } from '../both/collections/systemJS.collection';

const mainInstance = new Main();
mainInstance.start();
