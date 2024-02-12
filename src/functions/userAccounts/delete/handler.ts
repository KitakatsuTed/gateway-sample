import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { DeleteUserAccountService } from 'src/lib/services/useCases/deleteUserAccountService';

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
  },
  required: ['pathParameters'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const deleteUserAccountService = new DeleteUserAccountService();
  await deleteUserAccountService.execute({
    userAccountId: request.pathParameters.id,
  });

  return {
    statusCode: STATUS_CODE.NO_CONTENT,
    body: {
      data: {},
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });
