import { Main } from './imports/server-main/main';
import { Meteor } from 'meteor/meteor'; 
import { setupAdalApi } from './imports/api/adal/index';
import { setupMsGraphApi } from './imports/api/msGraph/index';

import './imports/publications/systemTenants.publication';
import './imports/publications';


Meteor.startup(() => {  
  setupAdalApi(); // instantiate new auth route for ms graph authentication
  setupMsGraphApi(); // instantiate new ms graph route for ms graph request
});

const mainInstance = new Main();
mainInstance.start();
