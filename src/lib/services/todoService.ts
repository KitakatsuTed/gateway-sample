import { ServiceBase } from "../dynamodb/services/serviceBase";
import { TodoCondition as Condition } from "../collections/conditions/todoCondition";
import { Todo as Entity } from "../entities/todo";
import { TodoCollection as Collection } from "../collections/todoCollection";
import { TodoRepository as Repository } from "../repositories/todoRepository";
import { DynamodbAccessable } from "../dynamodb/concerns/dynamodbAccessable";
import { Constructor } from "../dynamodb/concerns/Constructor";
import { dynamodbClient } from "../dynamodb/clients/dynamodb";

// https://github.com/microsoft/TypeScript/issues/5843#issuecomment-290972055
export class TodoService extends DynamodbAccessable(
  ServiceBase<Condition, Entity, Collection, Repository> as Constructor<
    ServiceBase<Condition, Entity, Collection, Repository>
  >,
) {
  constructor(client?: AWS.DynamoDB.DocumentClient) {
    super(new Repository(client || dynamodbClient));
  }
}
