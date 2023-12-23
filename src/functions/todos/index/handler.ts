import { eventDefaultSchema } from "../../../lib/middleware/middy/eventSchema";
import { FromSchema } from "json-schema-to-ts";
import { middyfy } from "../../../lib/middleware/middy/middify";
import { ResponseModel } from "../../../lib/middleware/middy/ResponseModel";
import { STATUS_CODE } from "../../../lib/exceptions/http/statusCode";
import TodoService from "../../../lib/dynamodb/services/TodoService";

// request: eventSchema.property で型付けされている。
async function main(_request: FromSchema<typeof eventDefaultSchema>): Promise<ResponseModel> {
  const todoService = new TodoService()

  const todos = await todoService.queryAllAsync(
    {
      queryInput: todoService.buildQueryInput({ id: 1 })
    }
  )

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: todos
    },
  }
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventDefaultSchema, handler: main })