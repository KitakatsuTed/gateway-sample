export const handler = async function (event: any, context: any) {
  const todo = {
    title: 'title1',
    describe: 'describe1',
    status: 'incomplete',
    doneAt: undefined
  }

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(todo)
  };
};
// https://qiita.com/tokkun5552/items/9e5cf5ebc817cbd4602e