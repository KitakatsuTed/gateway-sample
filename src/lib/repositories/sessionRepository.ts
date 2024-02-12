import * as AWS from 'aws-sdk';
import { RepositoryBase } from '../dynamodb/repositories/repositoryBase';
import { Session as Entity } from '../entities/session';
import { SessionCollection as Collection } from '../collections/sessionCollection';
import { SESSIONS_TABLE_NAME } from '../../../lib/dynamoDB/sessionsTable';

export class SessionRepository extends RepositoryBase<Entity, Collection> {
  protected tableName: string = SESSIONS_TABLE_NAME;

  protected getEntity(
    item?: AWS.DynamoDB.DocumentClient.AttributeMap,
  ): Entity | undefined {
    if (item === undefined) {
      return undefined;
    }

    // ここはitemのプロパティの型とEntityのinterfaceの型が同じであることをチェックしたい
    return new Entity(
      item.id,
      item.sessionId,
      item.userId,
      item.createdAt,
      item.updatedAt,
    );
  }

  protected createCollection(): Collection {
    return new Collection();
  }
}
