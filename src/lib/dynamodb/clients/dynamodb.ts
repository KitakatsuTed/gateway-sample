import * as AWS from "aws-sdk";

export const dynamodbClient = new AWS.DynamoDB.DocumentClient();
