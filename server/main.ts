import { Main } from './imports/server-main/main';
import './imports/methods/methods';
import './imports/publications/users.publication';
import './imports/publications/customers.publication';
import './imports/publications/customerInvoices.publication';
import './imports/publications';

const mainInstance = new Main();
mainInstance.start();
