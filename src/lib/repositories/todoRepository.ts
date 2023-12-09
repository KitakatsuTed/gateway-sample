import * as AWS from 'aws-sdk';
import { RepositoryBase } from './repositoryBase';
import { TodoCondition as Condition } from '../conditions/todoCondition';
import { ITodo as Entity } from '../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';

export class TodoRepository extends RepositoryBase<Condition, Entity, Collection> {
  protected tableName: string = 'todos';

  protected getEntity(item?: AWS.DynamoDB.DocumentClient.AttributeMap): Entity | undefined {
    if (item === undefined) {
      return undefined;
    }

    const entity: Entity = {
      id: item.id,
      status: item.status
    };

    Object.assign(entity, item);

    return entity;
  }

  protected createCollection(): Collection {
    return new Collection();
  }
}