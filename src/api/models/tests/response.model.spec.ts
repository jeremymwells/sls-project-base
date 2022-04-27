
import { Response } from '..';
import { ResponseMessage, ResponseStatus } from '../../enums';

describe('ResponseModel', () => {

  const statusCodeKeys = Object.keys(ResponseStatus).filter(elem => isNaN(Number(elem)));

  const pairs = statusCodeKeys.map(key => {
    const status = Number(key.replace('x', ''));
    return [status || ResponseStatus.x, ResponseMessage[key]];
  });

  it.each(pairs)('should return default response for %s %r', (status, message) => {

    const response = Response.GetDefault(status);
    expect(response.statusCode).toEqual(status);
    expect(response.body).toEqual(message);
  });
});
