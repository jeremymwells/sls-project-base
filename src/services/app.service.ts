import { Response } from '../api/models';

export class AppService {

  constructor (
    private event: any
  ) { }

  getResponse (): Response {
    if (!this.event.queryStringParameters?.message) {
      return Response.GetDefault(406);
    }
    return new Response(200, this.event.queryStringParameters?.message);
  }

}
