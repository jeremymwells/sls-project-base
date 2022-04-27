
const AWS = require('aws-sdk');
const pluralize = require('pluralize')

interface DDBQueryParams {
  KeyConditionExpression: string[],
  FilterExpression: string,
  ExpressionAttributeNames: any,
  ExpressionAttributeValues: any,
  IndexName?: string,
  modifiers?: any,
}

export abstract class RepoBase<T> {

  abstract partitionKey: string;
  overrideTableName = '';

  get tableName () {
    return [
      process.env.DDB_TABLE_PREFIX,
      this.overrideTableName || pluralize(this.model.name.toLowerCase())
    ].join('.');
  }

  constructor (
    private model : new () => T,
    private dynamoDB = new AWS.DynamoDB()
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

  private getValueForCondition(condition, value) {
    switch(condition.toLowerCase()) {

      case 'in': {
        const joinableValues = value.map((v) => {
          if (typeof v === 'number') {
            return v;
          }
          if (typeof v === 'string') {
            return `'${v}'`;
          }
        });
        return `[${joinableValues.join(', ')}]`;
      }

      case 'between': {
        if (value.length !== 2 || (typeof value[0] !== 'number' || typeof value[1] !== 'number')) {
          throw new Error(`Cannot use the ${condition} operator with more than 2 values`);
        }
        return value.join(' AND ')
      }

      default: {
        if (typeof value === 'number') {
          return value;
        } else if (typeof value === 'string') {
          return `'${value}'`
        } else {
          return value;
        }
      }
        
    }
  }

  private parseWhere (expression: any[], whereClause = '') {
    while (expression.length > 0) {
      const term = expression.shift();
      if (typeof term === 'object') {
        if (Array.isArray(term)) {
          whereClause += `${this.parseParams(term, whereClause)})`;
        } else {
          whereClause += '(';
          const joiner = (term.$join || 'and').toUpperCase();
          delete term.$join;

          const cond = (term.$cond || '=').toUpperCase();
          delete term.$cond;

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

  async selectAll (expressions: any[], projection = ['*'], config = {}) {
    const whereClause = this.parseWhere(expressions);
    const projections = projection[0] === '*' ? '*' : projection.map(p => `"${p}"`).join(', ');
    const Statement = [
      `SELECT ${projections}`, 
      `FROM "${this.tableName}"`,
      `WHERE ${whereClause}`
    ].join(' ');
    const result = await this.dynamoDB.executeStatement({ Statement, ...config }).promise();
    return result.Items.map(AWS.DynamoDB.Converter.unmarshall);
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
