import * as AWS from 'aws-sdk';
import { RepositoryBase } from './repositoryBase';
import { TodoCondition as Condition } from '../conditions/todoCondition';
import { Todo as Entity, ITodo as IEntity, Status } from '../../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';
import { TODOS_TABLE_NAME } from '../../../../lib/dynamoDB/todosTable';

export class TodoRepository extends RepositoryBase<Condition, Entity, Collection> {
  protected tableName: string = TODOS_TABLE_NAME;

  protected getEntity(item?: AWS.DynamoDB.DocumentClient.AttributeMap): Entity | undefined {
    if (item === undefined) {
      return undefined;
    }

    const entity: IEntity = {
      id: item.id,
      title: item.title,
      status: item.status,
      describe: item.describe,
      doneAt: item.doneAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    // 本当はスプレッド構文でサラッと書きたい
    return new Entity(
      entity.id,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
      entity.title,
      entity.describe,
      entity.doneAt,
    );
  }

  protected createCollection(): Collection {
    return new Collection();
  }
}