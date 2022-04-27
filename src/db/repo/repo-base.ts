
const AWS = require('aws-sdk');

interface DDBQueryParams {
  KeyConditionExpression: string[],
  FilterExpression: string,
  ExpressionAttributeNames: any,
  ExpressionAttributeValues: any,
  IndexName?: string,
  modifiers?: any,
}

export abstract class RepoBase<T> {

  abstract key: string;
  overrideTableName = '';

  get tableName () {
    return this.overrideTableName || this.model.constructor.name.toLowerCase();
  }

  constructor (
    private model : new () => T,
    private dynamoDB = new AWS.DynamoDB.DocumentClient()
  ) { }

  private parseParams (
    expr: any[],
    indexName = '',
    keyConditionExpressions = [],
    filterExpression = '(',
    attributeNames = {},
    attributeValues = {},
    modifiers = {}
  ): DDBQueryParams {

    while (expr.length > 0) {
      const term = expr.shift();
      if (typeof term === 'object') {

        if (Array.isArray(term)) {
          const result = this.parseParams(
            term,
            indexName,
            keyConditionExpressions,
            filterExpression,
            attributeNames,
            attributeValues,
            modifiers
          );
          filterExpression = `${result.FilterExpression})`;
          attributeNames = result.ExpressionAttributeNames;
          attributeValues = result.ExpressionAttributeValues;
          keyConditionExpressions = result.KeyConditionExpression;
          indexName = result.IndexName;
          modifiers = result.modifiers;
        } else {
          filterExpression += '(';
          const joiner = term.$join || 'AND';
          delete term.$join;

          const filterExpressionParts = Object.keys(term).map(key => {

            modifiers[key] = modifiers[key] || 1;
            if (attributeValues[`:${key}${modifiers[key]}`] ) {
              modifiers[key]++;
            }

            const valueKey = `${key}${modifiers[key]}`;

            // capture partition key
            if (key === this.key) {
              keyConditionExpressions.push(`#${key} = :${valueKey}`);
            }

            attributeNames[`#${key}`] = key;
            attributeValues[`:${valueKey}`] = term[key];
            return `#${key} = :${valueKey}`;
          });

          filterExpression += filterExpressionParts.join(` ${joiner.trim().toUpperCase()} `);
          filterExpression += ')';
        }

        // filterExpression += ')';
      } else if (typeof term === 'string') {
        filterExpression += ` ${term.trim().toUpperCase()} `;
      }

    }
    // filterExpression += ')';

    const params = {
      KeyConditionExpression: keyConditionExpressions,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
      modifiers
    } as any;

    if (indexName) {
      params.IndexName = indexName;
    }
    return params;
  }

  async queryBy (keyObject: any, expression: any[]): Promise<any> {
    const KeyConditionExpression = this.parseParams(keyObject).KeyConditionExpression;
    const params = {
      ...this.parseParams(expression),
      ...KeyConditionExpression,
      TableName: this.tableName
    };
    // const query = {
    //     TableName: process.env.TPO_MEDICAL_EXAMINATIONS_TABLE,
    //     ExpressionAttributeValues: {
    //       ":hashValue": 0,
    //     },
    //     KeyConditionExpression: `${tableIndex.examinations.SyncedExams.hash} = :hashValue`,
    //     IndexName: tableIndex.examinations.SyncedExams.name,
    //     Limit: limit,
    //   };
    return this.dynamoDB.query(params).promise();
  }
}

// async function logSingleItem() {
//     try {
//         var params = {
//             Key: {
//              "artist": {"S": "Arturus Ardvarkian"},
//              "song": {"S": "Carrot Eton"}
//             },
//             TableName: tableName
//         };
//         var result = await dynamodb.getItem(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logSingleItem()
