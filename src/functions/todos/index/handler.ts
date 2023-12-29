import { eventDefaultSchema } from '../../../lib/middleware/middy/eventSchema';
import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { TodoService } from '../../../lib/services/todoService';

// request: eventSchema.property で型付けされている。
async function main(
  _request: FromSchema<typeof eventDefaultSchema>,
): Promise<ResponseModel> {
  const todoService = new TodoService();

  const todos = await todoService.scanAllAsync({});

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: todos,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({
  eventSchema: eventDefaultSchema,
  handler: main,
});
