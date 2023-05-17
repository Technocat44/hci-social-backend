import { SwaggerController } from '@foal/swagger';

import { ApiController } from './api.controller';

/*
OpenAPI is how we interact with the backend through the url API, just like it is done in the Fast API

For 370 we were at https://webdev.cse.buffalo.edu/hci/api/swagger/#

*/
export class OpenApiController extends SwaggerController {
  options = { controllerClass: ApiController };
}