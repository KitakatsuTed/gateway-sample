import { FromSchema } from "json-schema-to-ts";
import { middyfy } from "../../../lib/middleware/middy/middify";
import { ResponseModel } from "../../../lib/middleware/middy/ResponseModel";
import { STATUS_CODE } from "../../../lib/exceptions/http/statusCode";
import { TodoService } from "../../../lib/dynamodb/services/todoService";
import { NotFoundException } from "../../../lib/exceptions/http/NotFoundException";

export const eventSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: {
          type: "string"
        }
      },
      required: ["id"]
    },
  },
  required: ['pathParameters']
} as const;

// request: eventSchema.property で型付けされている。
async function main(request: FromSchema<typeof eventSchema>): Promise<ResponseModel> {
  const todoService = new TodoService()

  const todo = await todoService.findBy(
    { id: request.pathParameters.id }
  )

  if (todo === undefined) {
    throw new NotFoundException(`Couldn't find Todo with ${request.pathParameters.id}`)
  }

  await todoService.delete(todo);

  return {
    statusCode: STATUS_CODE.NO_CONTENT,
    body: {},
  }
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main })
