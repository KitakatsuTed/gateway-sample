import { EntityBase } from '../dynamodb/entities/entityBase';

export type Status = 'active' | 'inactive';

// このディレクトリにはdynamo依存しないクラスも存在させることを許す
// dynamo依存させるときはEntityBaseを継承すれば良い
export class User extends EntityBase {
  constructor(
    public id: string | undefined,
    public name: string,
    public age: number,
    public status: Status,
    public createdAt?: number | undefined,
    public updatedAt?: number | undefined,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.status = status;
    this.age = age;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    // check presence
    const requiredAttrs: (keyof User)[] = ['name', 'status', 'age']
    requiredAttrs.forEach(attr => {
      if (!this[attr]) {
        this.errors.push({ [attr]: '入力してください' });
      }
    })

    return this.errors.length === 0;
  }
}
