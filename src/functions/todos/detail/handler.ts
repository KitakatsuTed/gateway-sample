import { FromSchema } from "json-schema-to-ts";
import { middyfy } from "../../../lib/middleware/middy/middify";
import { ResponseModel } from "../../../lib/middleware/middy/ResponseModel";
import { STATUS_CODE } from "../../../lib/http/statusCode";
import { TodoService } from "../../../lib/services/todoService";
import { NotFoundException } from "../../../lib/exceptions/http/NotFoundException";

export const eventSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
  },
  required: ["pathParameters"],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const todoService = new TodoService();

  // 自前で実装したい人はgetAsyncを直接使えば良い
  const todo = await todoService.findBy({ id: request.pathParameters.id });

  if (todo === undefined) {
    throw new NotFoundException(
      `Couldn't find Todo with ${request.pathParameters.id}`,
    );
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: todo,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });
