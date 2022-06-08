import { responseIfAnythingIsUnhandled } from '../../../decorators/response-if-anything-is-unhandled.decorator';
import { Response } from '../../../models';
import { AuthService } from '../../../../services';
import { parseBody } from '../../../decorators';

class AuthUserHandler {

  @parseBody()
  @responseIfAnythingIsUnhandled(Response.GetDefault(500))
  async register (event, _context, callback) {
    const response = await new AuthService(event).getRegisterResponse();
    response.send(callback);
  }

  @parseBody()
  @responseIfAnythingIsUnhandled(Response.GetDefault(500))
  async login (event, _context, callback) {
    const response = await new AuthService(event).getLoginResponse();
    response.send(callback);
  }


}

export const {
  register,
  login,
} = new AuthUserHandler();
