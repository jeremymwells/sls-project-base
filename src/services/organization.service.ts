import { OrganizationRepo } from '../db/repo/organization.repo';
import { Response } from '../api/models';

export class OrganizationService {

  constructor (
    private event: any,
    private organizationRepo = new OrganizationRepo()
  ) { }

  async getResponseAsync (): Promise<Response> {
    const { orgId } = this.event.queryStringParameters || { type: '', name: '' };
    let record;
    try {
      record = await this.organizationRepo.getOneById(Number(orgId));
    } catch (err) {
      console.error(err);
      return new Response(500, `[${this.constructor.name}] Error fetching record by id: '${orgId}'`).asPromise();
    }
    return new Response(200, record).asPromise();
  }

}
