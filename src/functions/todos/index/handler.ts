import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { TodoService } from '../../../lib/services/todoService';
import { QueryInputBase } from 'src/lib/dynamodb/conditions';

export const eventSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
      },
      required: ['userId'],
    },
  },
  required: ['pathParameters'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const todoService = new TodoService();

  const todos = await todoService.queryAsync({
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': request.pathParameters.userId,
    },
  } as unknown as QueryInputBase); // 型定義のままに実装するとDynamoDB側でエラーを吐くので無理やりキャストする

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: {
        todos: [...todos],
      },
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({
  eventSchema: eventSchema,
  handler: main,
});
