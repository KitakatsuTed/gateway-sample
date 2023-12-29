jest.mock('../../../../src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from '../../../../src/functions/todos/index/handler';
import * as TodoServiceModule from '../../../../src/lib/services/todoService';
import { STATUS_CODE } from '../../../../src/lib/http/statusCode';
import { TodoCollection } from '../../../../src/lib/collections/todoCollection';

const todoService = new TodoServiceModule.TodoService()
jest.mock("../../../../src/lib/dynamodb/services/serviceBase.ts")
jest.mock("../../../../src/lib/services/todoService.ts")
jest.spyOn(TodoServiceModule, 'TodoService').mockImplementation(() => todoService)
describe('handler', () => {
  const mockedTodoService = jest.mocked(todoService)
  const todoCollection = new TodoCollection()
  todoCollection.Count = 2
  mockedTodoService.scanAllAsync.mockResolvedValue(todoCollection)

  const event: any = {
    "body": {}
  }

  test('正常系', async () => {
    const actual = await handler.handler(event)
    console.log(actual)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {

      }
    })
  })
})