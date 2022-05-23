
import AWS from 'aws-sdk';
import pluralize from 'pluralize';

import { DynamoItem } from '../models/dynamo-item';

type keyedFrom<T> = keyof T|string;

export abstract class RepoBase<T extends DynamoItem> {

  abstract partitionKey: keyedFrom<T>;
  abstract sortKey: keyedFrom<T>;

  secondaryKey: keyedFrom<T>;
  overrideTableName = '';

  get tableName () {
    return [
      process.env.DDB_TABLE_PREFIX,
      this.overrideTableName || pluralize(this.modelConstructor.name.toLowerCase())
    ].filter(x => x).join('.');
  }

  constructor (
    private modelConstructor : new () => T,
    private dynamoDB: AWS.DynamoDB = new AWS.DynamoDB(),
    private dynamoDocClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient()
  ) { }

  // private getUpdateClause (item) {
  //   const params = {
  //     TableName: this.tableName,
  //     Key: { [this.partitionKey]: item[this.partitionKey], [this.sortKey]: item[this.sortKey] },
  //     ExpressionAttributeNames: {},
  //     ExpressionAttributeValues: {},
  //     UpdateExpression: 'SET'
  //   };

  //   // set last edited date to now
  //   item.lastEditedDate = Date.now();

  //   Object.keys(item).forEach(key => {
  //     if (key !== this.partitionKey && key !== this.sortKey) {
  //       const ean = `#${key}`;
  //       const eav = `:${key}`;
  //       params.ExpressionAttributeNames[ean] = key;
  //       params.ExpressionAttributeValues[eav] = item[key];
  //       params.UpdateExpression += ` ${ean} = ${eav},`
  //     }
  //   });

  //   params.UpdateExpression = params.UpdateExpression.slice(0, -1);
  //   console.log('UPDATE EXPRESSION', params);
  //   return params;
  // }

  private getValueForCondition (condition, value) {
    switch (condition.toLowerCase()) {

      case 'in': {
        const joinableValues = value.map(v => {
          if (typeof v === 'number') {
            return v;
          }
          if (typeof v === 'string') {
            return `'${v}'`;
          }
          return v;
        });
        return `[${joinableValues.join(', ')}]`;
      }

      case 'between': {
        if (value.length !== 2 || (typeof value[0] !== 'number' || typeof value[1] !== 'number')) {
          throw new Error(`Cannot use the ${condition} operator with more than 2 values`);
        }
        return value.join(' AND ');
      }

      default: {
        if (typeof value === 'number') {
          return value;
        } else if (typeof value === 'string') {
          return `'${value}'`;
        } else {
          return value;
        }
      }

    }
  }

  private convertToWhereClause (expression: any[], whereClause = '') {
    while (expression.length > 0) {
      const term = expression.shift();
      if (typeof term === 'object') {
        if (Array.isArray(term)) {
          whereClause += `${this.convertToWhereClause(term, whereClause)})`;
        } else {
          whereClause += '(';
          const joiner = (term.$join || 'and').toUpperCase();
          delete term.$join;

          const cond = (term.$condition || '=').toUpperCase();
          delete term.$condition;

          const filterExpressionParts = Object.keys(term).map(key => {
            const value = this.getValueForCondition(cond, term[key]);
            return `"${key}" ${cond} ${value}`;
          });

          whereClause += `${filterExpressionParts.join(` ${joiner.trim().toUpperCase()} `)})`;
        }

      } else if (typeof term === 'string') {
        whereClause += ` ${term.trim().toUpperCase()} `;
      }

    }
    return whereClause;
  }

  async selectAll (expressions: any[], projection: string[] = ['*'], secondaryIndexName = '', config = {}) {
    console.log('SELECTING ALL BY EXPRESSION & PROJECTION: ', expressions, projection);

    const whereClause = this.convertToWhereClause(expressions);
    console.log('SELECTING WHERE CLAUSE: ', whereClause);

    const projections = projection[0] === '*' ? '*' : projection.map(p => `"${p}"`).join(', ');

    const tableNameParts = [
      `"${this.tableName}"`,
      secondaryIndexName ? `"${secondaryIndexName}"` : secondaryIndexName
    ].join('.');

    const Statement = [
      `SELECT ${projections}`,
      `FROM ${tableNameParts}`,
      `WHERE ${whereClause}`
    ].join(' ');

    console.log('SELECTING OVERALL STATEMENT: ', Statement);
    const result = await this.dynamoDB.executeStatement({ Statement, ...config }).promise();

    console.log('SELECTED RESULT: ', result);
    return result.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));
  }

  async putItem (item: T): Promise<any> {
    item = item.toItem();
    if (!item.createdDate) {
      item.createdDate = Date.now();
    }
    item.lastEditedDate = Date.now();

    console.log('PUTTING ITEM: ', item);
    return this.dynamoDocClient.put({
      TableName: this.tableName,
      Item: item
    });
  }

  async updateItem (item: Partial<T>, config = {}) {
    item = item.toItem();

    console.log('UPDATING ITEM: ', item);
    const setters = Object.keys(item)
      .filter(key => key !== this.partitionKey && key !== this.sortKey)
      .map(key => {
        let value;
        if (typeof item[key] === 'number') {
          value = `${item[key]}`;
        }
        if (typeof item[key] === 'object') {
          value = `${JSON.stringify(item[key])}`;
        }
        if (typeof item[key] === 'string') {
          value = `'${item[key]}'`;
        }
        return `SET "${key}"=${value}\n`;
      });

    const Statement = [
      `UPDATE "${this.tableName}"`,
      `${setters.join('')}`,
      `WHERE "${this.partitionKey}"='${(item as any)[this.partitionKey]}' AND "${this.sortKey}"=${(item as any)[this.sortKey]}`
    ].join('\n');

    console.log('UPDATE STATEMENT: ', Statement);

    const result = await this.dynamoDB.executeStatement({ Statement, ...config }).promise();

    console.log('UPDATE RESULT: ', result);
    return Promise.resolve(result);
  }

}
