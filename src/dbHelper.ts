import AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

class BaseTable<T extends BaseDocument> {
    tableName: string;
    async save(document: BaseDocument, b: any) {
        const currentVersion = document.version || 0;
        await documentClient.put({
            TableName: this.tableName,
            Item: {
                ...document,
                version: currentVersion + 1,
            },
            ConditionExpression: 'attribute_not_exists(id) OR #version = :expectedVersion',
            ExpressionAttributeNames: {
                '#version': 'version'
            },
            ExpressionAttributeValues: {
                ':expectedVersion': currentVersion
            },
        }).promise();

    }
}

interface BaseDocument {
    id: string;
    version: number;
}

export function save(document: BaseDocument) {

}