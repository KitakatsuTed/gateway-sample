import { FromSchema } from "json-schema-to-ts";
import { middyfy } from "../../../lib/middleware/middy/middify";
import { ResponseModel } from "../../../lib/middleware/middy/ResponseModel";
import { STATUS_CODE } from "../../../lib/exceptions/http/statusCode";
import TodoService from "../../../lib/dynamodb/services/TodoService";
import { Todo } from "../../../lib/entities/todo";
import { UnprocessableEntityException } from "../../../lib/exceptions/http/UnprocessableEntityException";

export const eventSchema = {
  type: "object",
  properties: {
    pathParameters: {},
    body: {
      type: "object",
      properties: {
        title: {
          type: "string"
        },
        describe: {
          type: "string"
        },
        status: {
          enum: ["incomplete", "done"]
        },
      },
      required: ['status']
    },
  },
  required: ['body']
} as const;

// request: eventSchema.property で型付けされている。
async function main(request: FromSchema<typeof eventSchema>): Promise<ResponseModel> {
  // idに当たる引数をundefinedにするのはちょっと気持ち悪いけど、idは第一引数にいて欲しいので我慢する
  const todo = new Todo(
    undefined,
    request.body.status,
    request.body.title,
    request.body.describe,
    undefined,
  )
  const todoService = new TodoService()
  const res = await todoService.create(todo);

  if (!res) {
    throw new UnprocessableEntityException(undefined, todo.errors)
  }

  // 自前で実装したい人はgetAsyncを直接使えば良い
  // const todo = await todoService.create()

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: todo
    },
  }
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main })