import { EntityBase } from '../entities/entityBase';
import {
  DeleteItemInputBase,
  GetItemInputBase,
  PutItemInputBase,
  UpdateItemInputBase,
} from '../conditions';
import { CollectionBase } from '../collections/collectionBase';
import { RepositoryBase } from '../repositories/repositoryBase';
import { KeyNullException } from '../exceptions/keyNullException';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { getAttributes } from '../utility/getAttributes';
import { ServiceBase } from '../services/serviceBase';
import { DateTime } from 'luxon';
import { Constructor } from './Constructor';

type Item = {
  [key: string]: AttributeValue;
};

// テーブルと対になるクラスオブジェクトからDynamoDBの操作インターフェースを提供するモジュール
// Serviceクラスにmixinして使う
// ジェネリクスの依存関係の都合でService層での実装になり、constructorがrepositoryとentityの2つ引数を取るが
// entityのプロパティをそのままDBに反映させる使いやすさを目指したのでこれで割り切ることにする
export function DynamodbAccessable<
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
  TRepository extends RepositoryBase<TEntity, TCollection>,
>(Base: Constructor<ServiceBase<TEntity, TCollection, TRepository>>) {
  return class extends Base {
    async findBy(
      key: AWS.DynamoDB.DocumentClient.Key,
    ): Promise<TEntity | undefined> {
      const condition = {
        Key: key,
      } as GetItemInputBase;

      return await this.repository.getAsync(condition);
    }

    async create(
      entity: TEntity,
    ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput | undefined> {
      if (!entity.validate()) {
        return undefined; // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
      }

      const attr = getAttributes(entity);
      delete attr.id;

      const condition = {
        Item: attr,
      } as PutItemInputBase;

      return await this.repository.putAsync(condition);
    }

    async update(
      entity: TEntity,
      customCondition?: UpdateItemInputBase,
      ): Promise<{ response: AWS.DynamoDB.DocumentClient.UpdateItemOutput; entity: TEntity} | undefined> {
        if (entity.id === undefined) {
        throw new KeyNullException('idがセットされていません。');
      }

      if (!entity.validate()) {
        return undefined; // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
      }

      entity.updatedAt = DateTime.now().toMillis();
      // オブジェクトの現在のプロパティ値をそのまま全部使ってクエリを生成する
      // DBと同じ値だったとしても影響はないはず
      // 変更部分だけのクエリを用途ごとに実装しなくても良くなるはずなのでこれで良く、デフォルトが嫌なら自前でクエリを生成すれば良い。
      const buildDefaultUpdateQuery = (
        entity: TEntity,
      ): {
        UpdateExpression: string;
        ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
        ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
      } => {
        const attrs = getAttributes(entity);

        // id,createdAt,updatedAtはライブラリ側で制御するので実装による変更は認めない
        delete attrs.id;
        delete attrs.createdAt;

        const ExpressionAttributeNames = Object.fromEntries(
          Object.keys(attrs).map((key) => [`#${key}`, key]),
        );
        const ExpressionAttributeValues = Object.fromEntries(
          Object.keys(attrs).map((key) => [
            `:${key}`,
            entity[key as keyof TEntity],
          ]),
        );

        // 基本的に数が合わないことはないが合っていなければ、想定外の更新結果になるので弾いておく
        if (
          Object.keys(ExpressionAttributeNames).length !==
          Object.keys(ExpressionAttributeValues).length
        ) {
          throw `更新Queryの発行に失敗しました。ExpressionAttributeNamesとExpressionAttributeValuesのkey数が合いません。\nExpressionAttributeNames: ${ExpressionAttributeNames} ExpressionAttributeValues: ${ExpressionAttributeValues}`;
        }
        const UpdateExpression = 'SET';

        for (let i = 0; i < Object.keys(ExpressionAttributeNames).length; i++) {
          UpdateExpression.concat(
            `${Object.keys(ExpressionAttributeNames)[i]} = ${Object.keys(
              ExpressionAttributeValues,
            )}`,
          );
        }

        return {
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
        };
      };

      // 抽象化しているのでas unknown as TConditionは使わず型ガードしたかったが一旦as unknown as TConditionで対応
      // conditionのプロパティがオーバーライドなどで不適切になってもDynamo SDK側のエラーになるだけなので誤ったデータが入ることはないので割り切る
      const condition = {
        ...{
          Key: {
            id: entity.id,
          },
          ...buildDefaultUpdateQuery(entity),
        },
      } as unknown as UpdateItemInputBase;

      // 自前のConditionがあれば優先
      const response = await this.repository.updateAsync(customCondition || condition);

      return {
        response,
        entity
      }
    }

    async delete(
      entity: TEntity,
    ): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
      // バリデーションは基本いらないはず

      if (entity.id === undefined) {
        throw new KeyNullException('idがセットされていません。');
      }

      const condition = {
        Key: {
          id: entity.id,
        },
      } as unknown as DeleteItemInputBase;

      return await this.repository.deleteAsync(condition);
    }

    buildQueryInput(attributes: object): {
      ExpressionAttributeValues: Item;
      KeyConditionExpression: string;
    } {
      const exAttributes: Item = {};
      let KeyConditionExpression: string = '';

      for (const [key, value] of Object.entries(attributes)) {
        exAttributes[':' + key] = value;
        KeyConditionExpression = KeyConditionExpression.concat(
          `${key} = :${key}, `,
        );
      }

      // 最後のカンマを消す
      KeyConditionExpression = KeyConditionExpression.replace(/, $/, '');

      const ExpressionAttributeValues: Item = exAttributes;

      return { ExpressionAttributeValues, KeyConditionExpression };
    }

    validate(entity: TEntity): boolean {
      return entity.validate();
    }
  };
}
