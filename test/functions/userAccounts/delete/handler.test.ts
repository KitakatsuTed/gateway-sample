jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/userAccounts/delete/handler';
import * as DeleteUserAccountServiceModule from 'src/lib/services/useCases/deleteUserAccountService';
import { STATUS_CODE } from 'src/lib/http/statusCode';

describe('handler', () => {
  const deleteUserAccountService = new DeleteUserAccountServiceModule.DeleteUserAccountService()
  const spyOnDeleteUserAccountService = jest.spyOn(DeleteUserAccountServiceModule, 'DeleteUserAccountService').mockImplementation(() => deleteUserAccountService)
  const spyOnExecute = jest.spyOn(deleteUserAccountService, 'execute').mockResolvedValue(undefined)
  
  afterEach(() => {
    spyOnDeleteUserAccountService.mockReset();
    spyOnExecute.mockReset();
  });

  it('正常系', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        id: 'id',
      }
    }
    const actual = await handler.handler(event)

    expect(spyOnExecute).toHaveBeenCalledWith({
      userAccountId: 'id',
    })
    expect(actual).toEqual({
      statusCode: STATUS_CODE.NO_CONTENT,
      body: {
        data: {}
      }
    })
  })
})