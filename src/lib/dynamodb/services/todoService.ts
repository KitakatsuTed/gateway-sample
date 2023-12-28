import { ServiceBase } from './serviceBase';
import { TodoCondition as Condition } from '../conditions/todoCondition';
import { Todo as Entity } from '../../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';
import { TodoRepository as Repository } from '../repositories/todoRepository';
import { DynamodbAccessable } from '../concerns/dynamodbAccessable';
import { Constructor } from '../concerns/Constructor';
import { dynamodbClient } from '../clients/dynamodb';

// https://github.com/microsoft/TypeScript/issues/5843#issuecomment-290972055
export class TodoService extends DynamodbAccessable(ServiceBase<Condition, Entity, Collection, Repository> as Constructor<ServiceBase<Condition, Entity, Collection, Repository>>) {
  constructor(client?: AWS.DynamoDB.DocumentClient) {
    super(new Repository(client || dynamodbClient))
  }
}
