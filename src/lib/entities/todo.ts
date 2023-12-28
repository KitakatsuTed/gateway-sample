import { EntityBase } from "../dynamodb/entities/entityBase";

export type Status = 'incomplete' | 'done'

// このディレクトリにはdynamo依存しないクラスも存在させることを許す
// dynamo依存させるときはEntityBaseを継承すれば良い
export class Todo extends EntityBase {
  constructor(
    public id: string | undefined,
    public status: Status,
    public title?: string,
    public describe?: string,
    public doneAt?: number,
    public createdAt?: number | undefined,
    public updatedAt?: number | undefined,
  ) {
    super(id, createdAt, updatedAt);
    this.status = status
    this.title = title
    this.describe = describe
    this.doneAt = doneAt
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  validate() {
    if (this.title && this.title.length > 100) {
      this.errors.push({ title: '100文字以上は入力できません' })
    }

    return this.errors.length === 0
  }
}
