import { responseIfAnythingIsUnhandled } from '../../decorators/response-if-anything-is-unhandled.decorator';
import { responseIfPropAbsent } from '../../decorators/response-if-prop-absent.decorator';
import { Response } from '../../models';
import { OrganizationService } from '../../../services/organization.service';

class OrganizationHandler {

  @responseIfPropAbsent(Response.GetDefault(406), e => e.queryStringParameters?.orgId)
  @responseIfAnythingIsUnhandled(Response.GetDefault(500))
  async get (event, _context, callback) {
    const response = await new OrganizationService(event).getResponseAsync();
    response.send(callback);
  }

}

export const {
  get
} = new OrganizationHandler();
