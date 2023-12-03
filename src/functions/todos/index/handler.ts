import { DateTime } from "luxon";
import { Todo } from "../../../lib/models/todo";

export const handler = async function (event: any, context: any) {
  const todos: Todo[] = [
    {
      title: 'title1',
      describe: 'describe1',
      status: 'incomplete',
      doneAt: undefined
    },
    {
      title: 'titl2',
      describe: 'describe2',
      status: 'incomplete',
      doneAt: undefined
    },
    {
      title: 'title3',
      describe: 'describe3',
      status: 'done',
      doneAt: DateTime.now()
    },
  ]

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(todos)
  };
};
// https://qiita.com/tokkun5552/items/9e5cf5ebc817cbd4602e