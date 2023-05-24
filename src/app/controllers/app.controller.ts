import { Config, controller, IAppController } from '@foal/core';

import { ApiController } from './api.controller';
import { OpenApiController } from './openapi.controller';

/*
This app is run based on Foal TS https://foalts.org/docs/

We call Config.get() to grab the api_prefix that is in config/default.json file. the config folder is for different
enironments such as dev, prod, test, e2e (end to end), etc.

the api_prefix is set in the .env file. 
If the app is not served at the root of the domain, eg when behind a reverse proxy, what is the prefix it is served at?

In the case for our 370 class, we had the prefix set to 
<----------api_prefix----------------->
https://webdev.cse.buffalo.edu/hci/api/swagger/#/

In the react front end project
REACT_APP_API_PATH=
<----------api_prefix----------------->
https://webdev.cse.buffalo.edu/hci/api/api/echidna

*/
const prefix = Config.get('api_prefix', 'string', '');
export class AppController implements IAppController {
  subControllers = [
    controller(`${prefix}/swagger`, OpenApiController), // https://webdev.cse.buffalo.edu/hci/api/swagger/#/
    controller(`${prefix}/api/:tenantId`, ApiController), // https://webdev.cse.buffalo.edu/hci/api/api/echidna/users
  ];
}
