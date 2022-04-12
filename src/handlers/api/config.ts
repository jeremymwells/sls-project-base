import { responseIfAnythingIsUnhandled } from '../../decorators/response-if-anything-is-unhandled.decorator';
import { Response } from '../../models';

Error.stackTraceLimit = 100;
class ConfigHandler {

  @responseIfAnythingIsUnhandled(Response.GetDefault(500))
  async get(event, _context, callback) {

    const response = { send: () => {} };// await new ConfigResponse(event).getAsync();
    callback(null, response.send());

  }

}

export const { get } = new ConfigHandler();
