import { DateTime } from "luxon";

type Status = 'incomplete' | 'done'

export class Todo {
  constructor(public title: string, public describe: string, public status: Status, public doneAt?: DateTime) { }
}
