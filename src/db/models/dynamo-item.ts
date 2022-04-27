
export abstract class DynamoItem<T> {
  createDate: number;
  lastEditedDate: number;
  fromItem(item: any): T {
    return {...this, ...item} as T;
  };
}
