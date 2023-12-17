import { eventDefaultSchema } from "../../../lib/middleware/middy/eventSchema";
import { FromSchema } from "json-schema-to-ts";
import { middyfy } from "../../../lib/middleware/middy/middify";
import { ResponseModel } from "../../../lib/middleware/middy/ResponseModel";
import { STATUS_CODE } from "../../../lib/http/statusCode";

// request: eventSchema.property で型付けされている。
async function main(request: FromSchema<typeof eventDefaultSchema>): Promise<ResponseModel> {
  return {
    statusCode: STATUS_CODE.OK,
    body: {},
  }
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventDefaultSchema, handler: main })
