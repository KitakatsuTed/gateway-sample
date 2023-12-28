import { EntityBase } from '../entities/entityBase';
import { CollectionBase } from '../collections/collectionBase';
import { RepositoryBase } from '../repositories/repositoryBase';
import { ConditionBase } from '../conditions/conditionBase';

export abstract class ServiceBase<
  TCondition extends ConditionBase,
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
  TRepository extends RepositoryBase<TCondition, TEntity, TCollection>
> {

  public repository: TRepository;

  constructor(repository: TRepository) {
    this.repository = repository;
  }

  public async getAsync(condition: TCondition): Promise<TEntity | undefined> {
    return this.repository.getAsync(condition);
  }

  public async queryAsync(condition: TCondition): Promise<TCollection> {
    return this.repository.queryAsync(condition);
  }

  public async queryAllAsync(condition: TCondition): Promise<TCollection> {
    return this.repository.queryAllAsync(condition);
  }

  public async putAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    return this.repository.putAsync(condition);
  }

  public async updateAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
    return this.repository.updateAsync(condition);
  }

  public async deleteAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
    return this.repository.deleteAsync(condition);
  }
}