import * as AWS from 'aws-sdk';
import { EntityBase } from '../../entities/entityBase';
import { CollectionBase } from '../collections/collectionBase';
import { ConditionBase } from '../conditions/conditionBase';
import { DateTime } from 'luxon';
import { ArgumentNullException } from '../exceptions/ArgumentNullExceptions';

export interface IRepositoryBase<
  TCondition extends ConditionBase,
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>
> {
  getAsync(condition: TCondition): Promise<TEntity | undefined>;
  queryAsync(condition: TCondition): Promise<TCollection>;
  queryAllAsync(condition: TCondition): Promise<TCollection>;
  putAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>;
  updateAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput>;
  deleteAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>
}

const SEQUENCE_TABLE_NAME = 'sequence' as const

export abstract class RepositoryBase<
  TCondition extends ConditionBase,
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>
> implements IRepositoryBase<ConditionBase, TEntity, TCollection> {
  /**
   * テーブル名
   */
  protected abstract tableName: string;

  /**
   * DBコンテキスト
   */
  protected dbContext: AWS.DynamoDB.DocumentClient;

  /**
   * コンストラクタ
   * @param dbContext DBコンテキスト
   */
  constructor(dbContext: AWS.DynamoDB.DocumentClient) {
    this.dbContext = dbContext;
  }

  /**
   * 選択 get
   * @param condition パラメータ
   * @returns TEntity　もしくは undefined
   */
  public async getAsync(condition: TCondition): Promise<TEntity | undefined> {
    if (condition.getItemInput === undefined) {
      throw new ArgumentNullException();
    }

    // パラメータ設定
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: condition.getItemInput.Key
    };


    // コピー
    Object.assign(params, condition.getItemInput);

    // 発行するクエリをログに出す
    console.log(params);

    // データ取得
    const output = await this.dbContext.get(params).promise();

    // エンティティ取得
    return this.getEntity(output.Item);
  }

  /**
     * query
     * @param condition パラメータ
     * @returns コレクション
     */
  public async queryAsync(condition: TCondition): Promise<TCollection> {
    // DynamoDB queryパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput = this.createQueryParameters(condition);

    // 発行するクエリをログに出す
    console.log(params);

    // データ取得
    const output = await this.dbContext.query(params).promise();

    // コレクション
    const collection = this.createCollection();

    collection.Count = output.Count;
    collection.ScannedCount = output.ScannedCount;
    collection.LastEvaluatedKey = output.LastEvaluatedKey;
    collection.ConsumedCapacity = output.ConsumedCapacity;

    // 結果がある場合、コレクションに詰める
    if (output.Items !== undefined) {

      for (const item of output.Items) {
        // エンティティ取得
        const entity = this.getEntity(item);

        if (entity !== undefined) {
          // コレクション追加
          collection.add(entity);
        }
      }
    }

    return collection;
  }

  /**
   * 選択 queryAll
   * @param parameter パラメータ
   * @returns コレクション
   */
  public async queryAllAsync(condition: TCondition): Promise<TCollection> {
    // DynamoDB getItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput = this.createQueryParameters(condition);

    // 発行するクエリをログに出す
    console.log(params);

    // コレクション
    const collection = this.createCollection();

    // query
    const doQuery = async (
      parameters: AWS.DynamoDB.DocumentClient.QueryInput
    ) => {

      // データ取得
      const output: AWS.DynamoDB.DocumentClient.QueryOutput = await this.dbContext.query(parameters).promise();

      // 結果がある場合、コレクションに詰める
      if (output.Items !== undefined) {

        for (const item of output.Items) {
          // エンティティ取得
          const entity = this.getEntity(item);

          if (entity !== undefined) {
            // コレクション追加
            collection.add(entity);
          }
        }
      }

      if (output.LastEvaluatedKey) {
        parameters.ExclusiveStartKey = output.LastEvaluatedKey;

        // 再帰的呼出
        await doQuery(parameters);
      }
    };

    // 実行
    await doQuery(params);

    collection.Count = collection.size;

    return collection;
  }

  /**
   * 登録
   * @param condition パラメータ
   * @returns 実行結果
   */
  public async putAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    if (condition.putItemInput === undefined) {
      throw new ArgumentNullException();
    }

    // DynamoDB putItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: condition.putItemInput.Item
    };

    const newId = await this.getNewSequence();

    params.Item = {
      ...params.Item,
      id: newId,
      createdAt: DateTime.now().toMillis(),
      updatedAt: DateTime.now().toMillis(),
    }

    // パラメータコピー
    Object.assign(params, condition.putItemInput);

    // 発行するクエリをログに出す
    console.log(params);
    // データ追加
    return this.dbContext.put(params).promise();
  }

  /**
   * 更新
   * @param condition パラメータ
   * @returns 実行結果
   */
  public async updateAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
    if (condition.updateItemInput === undefined) {
      throw new ArgumentNullException();
    }

    // DynamoDB putItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: condition.updateItemInput.Key
    };

    // パラメータコピー
    Object.assign(params, condition.updateItemInput);

    // 発行するクエリをログに出す
    console.log(params);

    // 更新
    return this.dbContext.update(params).promise();
  }

  /**
   * 削除
   * @param condition パラメータ
   * @returns 実行結果
   */
  public async deleteAsync(condition: TCondition): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
    if (condition.deleteItemInput === undefined) {
      throw new ArgumentNullException();
    }

    // DynamoDB deleteItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: condition.deleteItemInput.Key
    };

    // パラメータコピー
    Object.assign(params, condition.updateItemInput);

    // 発行するクエリをログに出す
    console.log(params);

    // 削除
    return this.dbContext.delete(params).promise();
  }

  /**
   * エンティティ取得
   * @param item エンティティ
   * @returns エンティティ | undefined
   */
  protected abstract getEntity(item?: AWS.DynamoDB.DocumentClient.AttributeMap): TEntity | undefined;

  /**
   * コレクション作成（インスタンス生成のみ）
   */
  protected abstract createCollection(): TCollection;

  /**
   * queryパラメータ作成
   * @param condition 条件
   * @returns queryパラメータ
   */
  private createQueryParameters(
    condition: TCondition
  ): AWS.DynamoDB.DocumentClient.QueryInput {
    if (condition.queryInput === undefined) {
      throw new ArgumentNullException();
    }

    // DynamoDB queryパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName
    };

    // パラメータコピー
    Object.assign(params, condition.queryInput);

    return params;
  }

  // 最新のシークエンス値を取得
  // 各テーブルの最新のid値を採番する
  // 若干雑な実装な気がするが一旦これで
  private async getNewSequence(): Promise<number> {
    const params = {
      TableName: SEQUENCE_TABLE_NAME,
      Key: { name: this.tableName },
      updateItemInput: {
        UpdateExpression: "set currentNumber = currentNumber + :val",
        ExpressionAttributeValues: {
          ":val": 1
        },
        ReturnValues: "UPDATED_NEW"
      }
    };

    const id = await this.dbContext.update(params).promise()
    if (id.Attributes?.currentNumber === undefined) { throw '最新のid取得に失敗しました。' }

    return Number(id.Attributes?.currentNumber);
  }
}