import { Main } from './imports/server-main/main';
import './imports/publications/systemTenants.publication';
import './imports/publications';

const mainInstance = new Main();
mainInstance.start();
