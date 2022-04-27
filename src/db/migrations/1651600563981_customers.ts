import { MigrationContext } from 'mograte';
import { addId } from './util';

const pfx = process.env.DDB_TABLE_PREFIX;

const table = {
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    TableName: `${pfx}.customers`,
    StreamSpecification: {
        StreamEnabled: false
    }
};

export default {
    up: async (context: MigrationContext): Promise<any> => {
        await context.table.createAsync(table as any);
        const customers = require('./seed/customers.json');
        await context.item.writeAsync(customers.map((cust) => addId(cust)), table.TableName);
    },
    down: async (context: MigrationContext): Promise<any> => {
        await context.table.deleteAsync(table.TableName);
    }
}