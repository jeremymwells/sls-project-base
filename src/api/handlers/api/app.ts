import { responseIfAnythingIsUnhandled } from '../../decorators/response-if-anything-is-unhandled.decorator';
import { Response } from '../../models';
import { AppService } from '../../../services';

class AppHandler {

  @responseIfAnythingIsUnhandled(Response.GetDefault(500))
  async message (event, _context, callback) {
    const response = new AppService(event).getResponse();
    response.send(callback);
  }

}

export const {
  message
} = new AppHandler();
