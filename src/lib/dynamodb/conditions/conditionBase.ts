import * as AWS from "aws-sdk";
export abstract class ConditionBase {
  getItemInput?: {
    Key: AWS.DynamoDB.DocumentClient.Key;
    AttributesToGet?: AWS.DynamoDB.DocumentClient.AttributeNameList;
    ConsistentRead?: AWS.DynamoDB.DocumentClient.ConsistentRead;
    ReturnConsumedCapacity?: AWS.DynamoDB.DocumentClient.ReturnConsumedCapacity;
    ProjectionExpression?: AWS.DynamoDB.DocumentClient.ProjectionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
  };

  putItemInput?: {
    Item: AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap;
    Expected?: AWS.DynamoDB.DocumentClient.ExpectedAttributeMap;
    ReturnValues?: AWS.DynamoDB.DocumentClient.ReturnValue;
    ReturnConsumedCapacity?: AWS.DynamoDB.DocumentClient.ReturnConsumedCapacity;
    ReturnItemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ReturnItemCollectionMetrics;
    ConditionalOperator?: AWS.DynamoDB.DocumentClient.ConditionalOperator;
    ConditionExpression?: AWS.DynamoDB.DocumentClient.ConditionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
  };

  queryInput?: {
    IndexName?: AWS.DynamoDB.DocumentClient.IndexName;
    Select?: AWS.DynamoDB.DocumentClient.Select;
    AttributesToGet?: AWS.DynamoDB.DocumentClient.AttributeNameList;
    Limit?: AWS.DynamoDB.DocumentClient.PositiveIntegerObject;
    ConsistentRead?: AWS.DynamoDB.DocumentClient.ConsistentRead;
    KeyConditions?: AWS.DynamoDB.DocumentClient.KeyConditions;
    QueryFilter?: AWS.DynamoDB.DocumentClient.FilterConditionMap;
    ConditionalOperator?: AWS.DynamoDB.DocumentClient.ConditionalOperator;
    ScanIndexForward?: AWS.DynamoDB.DocumentClient.BooleanObject;
    ExclusiveStartKey?: AWS.DynamoDB.DocumentClient.Key;
    ReturnConsumedCapacity?: AWS.DynamoDB.DocumentClient.ReturnConsumedCapacity;
    ProjectionExpression?: AWS.DynamoDB.DocumentClient.ProjectionExpression;
    FilterExpression?: AWS.DynamoDB.DocumentClient.ConditionExpression;
    KeyConditionExpression?: AWS.DynamoDB.DocumentClient.KeyExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
  };

  updateItemInput?: {
    Key: AWS.DynamoDB.DocumentClient.Key;
    AttributeUpdates?: AWS.DynamoDB.DocumentClient.AttributeUpdates;
    Expected?: AWS.DynamoDB.DocumentClient.ExpectedAttributeMap;
    ConditionalOperator?: AWS.DynamoDB.DocumentClient.ConditionalOperator;
    ReturnValues?: AWS.DynamoDB.DocumentClient.ReturnValue;
    ReturnConsumedCapacity?: AWS.DynamoDB.DocumentClient.ReturnConsumedCapacity;
    ReturnItemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ReturnItemCollectionMetrics;
    UpdateExpression?: AWS.DynamoDB.DocumentClient.UpdateExpression;
    ConditionExpression?: AWS.DynamoDB.DocumentClient.ConditionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
  };

  deleteItemInput?: {
    Key: AWS.DynamoDB.DocumentClient.Key;
    Expected?: AWS.DynamoDB.DocumentClient.ExpectedAttributeMap;
    ConditionalOperator?: AWS.DynamoDB.DocumentClient.ConditionalOperator;
    ReturnValues?: AWS.DynamoDB.DocumentClient.ReturnValue;
    ReturnConsumedCapacity?: AWS.DynamoDB.DocumentClient.ReturnConsumedCapacity;
    ReturnItemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ReturnItemCollectionMetrics;
    ConditionExpression?: AWS.DynamoDB.DocumentClient.ConditionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
    ReturnValuesOnConditionCheckFailure?: AWS.DynamoDB.DocumentClient.ReturnValuesOnConditionCheckFailure;
  };
}
