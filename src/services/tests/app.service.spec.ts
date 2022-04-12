import { AppService } from '..';
import { Response } from '../../models';

describe('AppService', () => {

  const eventResults = [
    { message: 'foo', get response() { return new Response(200, this.message); } },
    { message: 'bar', get response() { return new Response(200, this.message); } },
    { message: 'baz', get response() { return new Response(200, this.message); } },
    { message: '', get response() { return Response.GetDefault(406) } },
  ];

  const getEvent = (eventResult) => {
    let event = <any>{ };
    if (eventResult.message) {
      event.queryStringParameters = { message: eventResult.message };
    } else {
      event.queryStringParameters = { };
    }
    event.testResponse = eventResult.response;
    return event;
  }

  let theEvent, appServiceResponse;

  eventResults.forEach((eventResult) => {

    it(`should read querystringParameters message '${eventResult.message}' and return response with ${eventResult.response.statusCode} status`, () => {
      theEvent = getEvent(eventResult);
      appServiceResponse = new AppService(theEvent).getResponse();

      expect(appServiceResponse).toEqual(eventResult.response);
    });

  });

  
});