import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { TodoService } from '../../../lib/services/todoService';
import { UnprocessableEntityException } from '../../../lib/exceptions/http/UnprocessableEntityException';
import { DateTime } from 'luxon';
import { NotFoundException } from '../../../lib/exceptions/http/NotFoundException';

export const eventSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      required: ['id'],
    },
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        describe: {
          type: 'string',
        },
        status: {
          enum: ['incomplete', 'done'],
        },
        doneAt: {
          type: 'string',
        },
      },
      required: ['status'],
    },
  },
  required: ['pathParameters', 'body'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const todoService = new TodoService();
  const todo = await todoService.findBy({ id: request.pathParameters.id });

  if (todo === undefined) {
    throw new NotFoundException(
      `Couldn't find Todo with ${request.pathParameters.id}`,
    );
  }

  todo.assignAttribute({
    title: request.body.title,
    describe: request.body.describe,
    status: request.body.status,
    doneAt: request.body.doneAt
      ? DateTime.fromISO(request.body.doneAt).toMillis()
      : undefined,
  });

  const res = await todoService.update(todo);

  if (!res) {
    throw new UnprocessableEntityException(undefined, todo.errors);
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: res.entity,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });
