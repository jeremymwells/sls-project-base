import { MigrationContext } from "mograte";

const pfx = process.env.DDB_TABLE_PREFIX;

const table = {
  KeySchema: [
    { AttributeName: 'type',  KeyType: 'HASH' },
    { AttributeName: 'id', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'type', AttributeType: 'S' },
    { AttributeName: 'id', AttributeType: 'N' },
    { AttributeName: 'searchName', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [{ 
      IndexName: 'searchName',
      KeySchema: [{
        AttributeName: 'searchName',
        KeyType: 'HASH'
      }],
      Projection: {
        ProjectionType: 'ALL'
      }
    },{
      IndexName: '_id',
      KeySchema: [{
        AttributeName: 'id',
        KeyType: 'HASH'
      }],
      Projection: {
        ProjectionType: 'ALL'
      }
  }],
  BillingMode: 'PAY_PER_REQUEST',
  TableName: `${pfx}.organizations`,
  StreamSpecification: {
    StreamEnabled: false
  }
};

export default {
  up: async (context: MigrationContext): Promise<any> => {
    await context.table.createAsync(table as any);
    const organizations = require('./seed/organizations.json');
    await context.item.writeAsync(organizations, table.TableName);
  },
  down: async (context: MigrationContext): Promise<any> => {
    await context.table.deleteAsync(table.TableName);
  }
}