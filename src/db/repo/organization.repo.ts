import { Organization } from '../models';

import { RepoBase } from './repo-base';

export class OrganizationRepo extends RepoBase<Organization> {
  partitionKey = 'type';
  sortKey = 'id';

  constructor () {
    super(Organization);
  }

  async getAllByType (type: string) {
    const orgs = await this.selectAll([{ [this.partitionKey]: type }], ['*']);
    return Promise.resolve(orgs.map(org => new Organization().fromItem(org)));
  }

  async getOneById (id: number) {
    const orgs = await this.selectAll([{ id }], ['*'], '_id');
    return Promise.resolve(new Organization().fromItem(orgs[0]));
  }

  async getOneBySearchName (searchName: string) {
    const orgs = await this.selectAll([{ searchName }], ['*'], 'searchName');
    return Promise.resolve(new Organization().fromItem((orgs || [])[0]));
  }

  async getAllByTypeAndName (type: string, name: string): Promise<Organization[]> {
    const orgs = await this.selectAll(
      [{ [this.partitionKey]: type, searchName: name.toLowerCase() }],
      ['*'],
      'searchName'
    );
    return Promise.resolve(orgs.map(org => new Organization().fromItem(org)));
  }

  async putOne (organization: Organization): Promise<Organization> {
    const type = organization[this.partitionKey] || 'unknown';
    const id = organization[this.sortKey] || Date.now();

    return this.putItem({
      ...organization,
      [this.partitionKey]: type,
      [this.sortKey]: id
    } as any);
  }
}
