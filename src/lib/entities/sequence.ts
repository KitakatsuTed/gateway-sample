import { EntityBase } from "./entityBase";

export class Sequence extends EntityBase {
  constructor(
    public id: string | undefined,
    public createdAt: number | undefined,
    public updatedAt: number | undefined,
  ) {
    super(id, createdAt, updatedAt);
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  validate(): boolean {
    return true
  }
}
