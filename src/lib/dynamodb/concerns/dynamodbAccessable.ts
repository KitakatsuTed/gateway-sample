import { EntityBase } from "../../entities/entityBase";
import { ConditionBase } from "../conditions/conditionBase";
import { CollectionBase } from "../collections/collectionBase";
import { RepositoryBase } from "../repositories/repositoryBase";
import { KeyNullException } from "../../exceptions/keyNullException";
import { getClassProperties } from "../../utility/getClassProperties";


type Constructor<T = {}> = new (...args: any[]) => T;

// テーブルと対になるクラスオブジェクトからDynamoDBの操作インターフェースを提供するモジュール
// Serviceクラスにmixinして使う
// ジェネリクスの依存関係の都合でService層での実装になり、constructorがrepositoryとentityの2つ引数を取るが
// entityのプロパティをそのままDBに反映させる使いやすさを目指したのでこれで割り切ることにする
export function DynamodbAccessable<
  TCondition extends ConditionBase,
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
  TRepository extends RepositoryBase<TCondition, TEntity, TCollection>,
  TBase extends Constructor
>(Base: TBase) {
  return class extends Base {
    public repository: TRepository;
    public entity: TEntity;

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

      return await this.repository.putAsync(condition)
    }

    async update(customCondition?: TCondition): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput | undefined> {
      if (this.entity.id === undefined) {
        throw new KeyNullException(`idがセットされていません。`)
      }

      if (!this.validate()) {
        return undefined // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
      }

      // 抽象化しているのでas unknown as TConditionは使わず型ガードしたかったが一旦as unknown as TConditionで対応
      // conditionのプロパティがオーバーライドなどで不適切になってもDynamo SDK側のエラーになるだけなので誤ったデータが入ることはないので割り切る
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

      return await this.repository.deleteAsync(condition)
    }

    // クラスのインスタンスのインターフェースに一致する属性値のオブジェクトを返す
    getAttributes(): TEntity {
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
    buildDefaultUpdateQuery(): { UpdateExpression: string, ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap, ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap } {
      'SET #attrs.#attr1 = #attr, #attrs.#attr2 = :zero REMOVE #attr'
      const attrs = this.getAttributes()
      const ExpressionAttributeNames = Object.fromEntries(Object.keys(attrs).map((key) => [`#${key}`, key]))
      const ExpressionAttributeValues = Object.fromEntries(Object.keys(attrs).map((key) => [`:${key}`, this.entity[key as keyof TEntity]]))

      // 基本的に数が合わないことはないが合っていなければ、想定外の更新結果になるので弾いておく
      if (Object.keys(ExpressionAttributeNames).length !== Object.keys(ExpressionAttributeValues).length) {
        throw `更新Queryの発行に失敗しました。ExpressionAttributeNamesとExpressionAttributeValuesのkey数が合いません。\nExpressionAttributeNames: ${ExpressionAttributeNames} ExpressionAttributeValues: ${ExpressionAttributeValues}`
      }
      const UpdateExpression = 'SET'

      for (let i = 0; i < Object.keys(ExpressionAttributeNames).length; i++) {
        UpdateExpression.concat(`${Object.keys(ExpressionAttributeNames)[i]} = ${Object.keys(ExpressionAttributeValues)}`)
      }

      return { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    }
  };
}