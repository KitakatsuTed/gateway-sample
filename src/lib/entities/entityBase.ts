// https://blog.serverworks.co.jp/dynamodb-cheatsheet
export interface IEntityBase {
  id: string | undefined;
  createdAt?: number;
  updatedAt?: number;
}

// keyはジェネリクスのkeyに依存させたかった
type Error = Record<string, string>

export abstract class EntityBase {
  public errors: Error[]

  constructor(
    public id: string | undefined,
    public createdAt: number | undefined, 
    public updatedAt: number | undefined,
  ) {
    this.errors = []
  }

  abstract validate(): boolean;

  idPersisted(): boolean {
    return !!this.id
  }
}
