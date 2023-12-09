import { DateTime } from "luxon";
import { IEntityBase } from "./entityBase";

type Status = 'incomplete' | 'done'

export interface ITodo extends IEntityBase {
  id: number;
  title?: string;
  describe?: string;
  status: Status;
  doneAt?: DateTime;
}
