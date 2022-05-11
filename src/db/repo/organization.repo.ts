import { Organization } from '../models';

import { RepoBase } from './repo-base';

export class OrganizationRepo extends RepoBase<Organization> {
  key = 'type';

  constructor () {
    super(Organization);
  }

  getAllByObject (_obj: any): Promise<any> {
    return Promise.resolve(
      // this.queryBy([obj])
    );
  }

  getAllBy (_key, name: string): Promise<any> {
    return Promise.resolve(
      this.queryBy(
        { key: this.key },
        [
          { type: 'landscaping', searchName: name.toLowerCase() },
          'or',
          [{ type: 'banking', searchName: name.toLowerCase(), $join: 'or' }]
        ]
      )
    );
  }

}
