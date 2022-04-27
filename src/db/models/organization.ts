
import { Address } from './address';
import { DynamoItem } from './dynamo-item';

export class Organization extends DynamoItem<Organization> {
  type: string;

  get searchName (): string {
    return this.name.toLowerCase();
  }

  name: string;
  addresses: Address[];
}
