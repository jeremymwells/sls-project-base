import { OrganizationRepo } from '../db/repo/organization.repo';
import { Response } from '../api/models';

export class OrganizationService {

  constructor (
    private event: any,
    private organizationRepo = new OrganizationRepo()
  ) { }

  async getResponseAsync (): Promise<Response> {
    const name = this.event.queryStringParameters?.name || '';
    let record;
    try {
      record = await this.organizationRepo.getAllBy({ key: 'asdf' }, name);
    } catch (err) {
      console.error(err);
      return new Response(500, `[${this.constructor.name}] Error fetching record by name: '${name}'`).asPromise();
    }
    return new Response(200, record).asPromise();
  }

}
