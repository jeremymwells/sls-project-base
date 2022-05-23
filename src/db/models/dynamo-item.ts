
export abstract class DynamoItem {
  createdDate: number;
  lastEditedDate: number;
  createdBy: string;
  lastEditedBy: string;
  abstract toItem(); // transforms any properties for saving
  abstract fromItem(item: any); // transforms any dynamodb records for use in app
}
