
import { Response } from '../../models';
import { ResponseMessage, ResponseStatus } from '../../enums';

describe('ResponseModel', () => {

    const statusCodeKeys = Object.keys(ResponseStatus).filter(elem => isNaN(Number(elem)));
    console.log(statusCodeKeys);
    // for (let statusCodeKey in statusCodeKeys) {
        const pairs = statusCodeKeys.map((key) => {
            const status = Number(key.replace('x', ''));
            return [status ? status: ResponseStatus.x, ResponseMessage[key]];
        })
        console.log(pairs);
        it.each(pairs)(`should return default response for %s %r`, (status, message) => {

            const response = Response.GetDefault(status);
            expect(response.statusCode).toEqual(status);
            expect(response.body).toEqual(message);
        });
        
        // it(``, () => {

        // })
    // }

  
});