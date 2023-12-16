import { IEntityBase, EntityBase } from "./entityBase";

export type Status = 'incomplete' | 'done'

export interface ITodo extends IEntityBase {
  title?: string;
  describe?: string;
  status: Status;
  doneAt?: number;
}

export class Todo extends EntityBase implements ITodo {
  constructor(
    public id: string | undefined,
    public status: Status,
    public createdAt: number | undefined,
    public updatedAt: number | undefined,
    public title?: string,
    public describe?: string,
    public doneAt?: number,
  ) {
    super(id, createdAt, updatedAt);
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
}
