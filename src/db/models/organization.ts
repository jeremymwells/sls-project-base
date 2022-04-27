
import { Address } from './address';
import { DynamoItem } from './dynamo-item';

export class Organization extends DynamoItem {
  type: string;

  get searchName (): string {
    return this.name.toLowerCase();
  }

  name: string;
  addresses: Address[];

  static From (partialOrg: Partial<Organization>) {
    const organization = new Organization();
    return { ...organization, ...partialOrg };
  }
}
