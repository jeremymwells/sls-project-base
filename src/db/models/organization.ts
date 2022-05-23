
import { Address } from './address';
import { DynamoItem } from './dynamo-item';

// eslint-disable-next-line no-use-before-define
export class Organization extends DynamoItem {
  name: string;
  searchName: string;
  type: string;
  addresses: Address[];

  toItem () { // transforms any properties for saving
    this.searchName = this.name.toLowerCase();
    return this;
  }

  fromItem (item: any) { // transforms any dynamodb records for use in app
    if (!item) { return; }
    const org = new Organization();
    Object.keys(item).forEach(key => {
      org[key] = item[key];
    });
    return org;
  }
}
