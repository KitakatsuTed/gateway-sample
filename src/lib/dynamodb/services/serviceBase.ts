import { EntityBase } from '../../entities/entityBase';
import { CollectionBase } from '../collections/collectionBase';
import { RepositoryBase } from '../repositories/repositoryBase';
import { ConditionBase } from '../conditions/conditionBase';
import { getClassProperties } from '../../utility/getClassProperties';
import { KeyNullException } from '../../exceptions/keyNullException';

export abstract class ServiceBase<
  TCondition extends ConditionBase,
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
  TRepository extends RepositoryBase<TCondition, TEntity, TCollection>
> {

  protected repository: TRepository;
  public entity: TEntity;

  constructor(entity: TEntity, repository: TRepository) {
    this.repository = repository;
    this.entity = entity;
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

  validate(): boolean {
    return this.entity.validate()
  }

  async create(): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput | undefined> {
    if (!this.validate()) {
      return undefined // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
    }

    const condition = {
      putItemInput: {
        Item: {
          ...Object(this.getAttributes())
        }
      }
    } as TCondition
    
    return await this.putAsync(condition)
  }

  async update(customCondition?: TCondition): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput | undefined> {
    if (this.entity.id === undefined) {
      throw new KeyNullException(`idがセットされていません。`)
    } 

    if (!this.validate()) {
      return undefined // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
    }

    const condition: TCondition = {
      updateItemInput: {
        Key: ({
          id: this.entity.id,
        }),
        ...this.buildDefaultUpdateQuery()
      }
    } as unknown as TCondition

    // 自前のConditionがあれば優先
    return await this.repository.updateAsync(customCondition || condition)
  }

  async delete(): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
    // バリデーションは基本いらないはず

    if (this.entity.id === undefined) {
      throw new KeyNullException(`idがセットされていません。`)
    } 

    const condition = {
      deleteItemInput: {
        Key: ({
          id: this.entity.id,
        }),
      }
    } as unknown as TCondition

    return await this.deleteAsync(condition)
  }

  // クラスのインスタンスのインターフェースに一致する属性値のオブジェクトを返す
  getAttributes(): TEntity{
    let attrs = {}
    const propertyKeys = getClassProperties(this.entity)
    
    propertyKeys.forEach((key) => {
      const attr = { [key]: this.entity[key as keyof TEntity] }
      attrs = { ...attrs, ...attr }
    })

    return attrs as TEntity
  }

  // オブジェクトの現在のプロパティ値をそのまま全部使ってクエリを生成する
  // DBと同じ値だったとしても影響はないはず
  // 変更部分だけのクエリを用途ごとに実装しなくても良くなるはずなのでこれで良く、デフォルトが嫌なら自前でクエリを生成すれば良い。
  private buildDefaultUpdateQuery(): { UpdateExpression: string, ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap, ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap } {
    'SET #attrs.#attr1 = #attr, #attrs.#attr2 = :zero REMOVE #attr'
    const attrs = this.getAttributes()
    const ExpressionAttributeNames = Object.fromEntries(Object.keys(attrs).map((key) => [`#${key}`, key]))
    const ExpressionAttributeValues = Object.fromEntries(Object.keys(attrs).map((key) => [`:${key}`, this.entity[key as keyof TEntity]]))

    // 基本的に数が合わないことはないが合っていなければ、想定外の更新結果になるので弾いておく
    if (Object.keys(ExpressionAttributeNames).length !== Object.keys(ExpressionAttributeValues).length) {
      throw `更新Queryの発行に失敗しました。ExpressionAttributeNamesとExpressionAttributeValuesのkey数が合いません。\nExpressionAttributeNames: ${ExpressionAttributeNames} ExpressionAttributeValues: ${ExpressionAttributeValues}`
    }
    const UpdateExpression = 'SET'
    
    for(let i = 0; i < Object.keys(ExpressionAttributeNames).length; i++){
      UpdateExpression.concat(`${Object.keys(ExpressionAttributeNames)[i]} = ${Object.keys(ExpressionAttributeValues)}`)
    }

    return { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
  }
}