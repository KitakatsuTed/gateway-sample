// https://blog.serverworks.co.jp/dynamodb-cheatsheet
export interface IEntityBase {
  id: string;
  createdAt?: number;
  updatedAt?: number;
}

// keyはジェネリクスのkeyに依存させたかった
type Error = Record<string, string>

export abstract class EntityBase {
  public errors: Error[]

  constructor(
    public createdAt?: number, 
    public updatedAt?: number,
  ) {
    this.errors = []
  }
}
