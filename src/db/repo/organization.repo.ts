import { Organization } from '../models';

import { RepoBase } from './repo-base';

export class OrganizationRepo extends RepoBase<Organization> {
  partitionKey = 'type';

  constructor () {
    super(Organization);
  }

  getByType (type: string) {
    this.selectAll([ { [this.partitionKey]: type } ], ['*']);
  }

  async getAllByName (type: string, name: string): Promise<Organization[]> {
    const orgs = await this.selectAll([
        { [this.partitionKey]: type },
        'AND',
        { searchName: [ name.toLowerCase() ], $cond: 'IN' }
      ],
      ['*']
    );
    return Promise.resolve(orgs.map((org) => new Organization().fromItem(org)));
  }

}
