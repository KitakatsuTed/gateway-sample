import { TodoRepository } from "../dynamodb/repositories/todoRepository";
import { IEntityBase, EntityBase } from "./entityBase";
import { dynamodbClient as dbContext } from "../clients/dynamodb"
import { TodoCondition } from "../dynamodb/conditions/todoCondition";
import { getClassProperties } from "../utility/getClassProperties";
import * as AWS from 'aws-sdk';

export type Status = 'incomplete' | 'done'

export interface ITodo extends IEntityBase {
  title?: string;
  describe?: string;
  status: Status;
  doneAt?: number;
}

export class Todo extends EntityBase implements ITodo {
  constructor(
    public id: string,
    public status: Status,
    public createdAt?: number,
    public updatedAt?: number,
    public title?: string,
    public describe?: string,
    public doneAt?: number,
  ) {
    super(createdAt, updatedAt);
    this.id = id
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.title = title
    this.describe = describe
    this.doneAt = doneAt
  }

  validate() {
    if (this.title && this.title.length > 100) {
      this.errors.push({ title: '100文字以上は入力できません' })
    }

    return this.errors.length === 0
  }

  async create(): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput | undefined> {
    if (!this.validate()) {
      return undefined // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
    }

    const condition: TodoCondition = {
      putItemInput: {
        Item: {
          ...Object(this.getAttributes())
        }
      }
    }
    
    return await new TodoRepository(dbContext).putAsync(condition)
  }

  async update(customCondition?: TodoCondition): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput | undefined> {
    if (!this.validate()) {
      return undefined // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
    }

    const condition: TodoCondition = {
      updateItemInput: {
        Key: ({
          id: this.id,
        }),
        ...this.buildDefaultUpdateQuery()
      }
    }

    // 自前のConditionがあれば優先
    return await new TodoRepository(dbContext).updateAsync(customCondition || condition)
  }

  async delete(): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
    // バリデーションは基本いらないはず

    const condition: TodoCondition = {
      deleteItemInput: {
        Key: ({
          id: this.id,
        }),
      }
    }

    return await new TodoRepository(dbContext).deleteAsync(condition)
  }

  // クラスのインスタンスのインターフェースに一致する属性値のオブジェクトを返す
  getAttributes(): ITodo {
    let attrs = {}
    const propertyKeys = getClassProperties(this)
    
    propertyKeys.forEach((key) => {
      const attr = { [key]: this[key as keyof ITodo] }
      attrs = { ...attrs, ...attr }
    })

    return attrs as ITodo
  }

  // オブジェクトの現在のプロパティ値をそのまま全部使ってクエリを生成する
  // DBと同じ値だったとしても影響はないはず
  // 変更部分だけのクエリを用途ごとに実装しなくても良くなるはずなのでこれで良く、デフォルトが嫌なら自前でクエリを生成すれば良い。
  private buildDefaultUpdateQuery(): { UpdateExpression: string, ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap, ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap } {
    'SET #attrs.#attr1 = #attr, #attrs.#attr2 = :zero REMOVE #attr'
    const attrs = this.getAttributes()
    const ExpressionAttributeNames = Object.fromEntries(Object.keys(attrs).map((key) => [`#${key}`, key]))
    const ExpressionAttributeValues = Object.fromEntries(Object.keys(attrs).map((key) => [`:${key}`, this[key as keyof ITodo]]))

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
