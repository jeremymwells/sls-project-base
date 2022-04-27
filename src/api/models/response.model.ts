import { ResponseMessage, ResponseStatus } from '../enums';

export class Response {
  public statusCode: number;

  public body: string;
  // public headers: any;

  constructor (
    statusCode: number,
    body: any
  ) {
    this.statusCode = statusCode;

    if (typeof body === 'object') {
      this.body = JSON.stringify(body);
    } else {
      this.body = body.toString();
    }
  }

  asPromise () {
    return Promise.resolve(this);
  }

  send (callback: any) {
    console.log('SENDING RESPONSE', this);
    callback(null, this);
  }

  static GetDefault (statusCode: number) {
    switch (statusCode) {
      case 200: return new Response(ResponseStatus.x200, ResponseMessage.x200);
      case 202: return new Response(ResponseStatus.x202, ResponseMessage.x202);
      case 401: return new Response(ResponseStatus.x401, ResponseMessage.x401);
      case 403: return new Response(ResponseStatus.x403, ResponseMessage.x403);
      case 406: return new Response(ResponseStatus.x406, ResponseMessage.x406);
      default: return new Response(ResponseStatus.x, ResponseMessage.x);
    }
  }

}
