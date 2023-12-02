import { Construct } from "constructs";
import { Function, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';

export const functionTodoDetail = (scope: Construct) => {
  const functionNameTodoDetail = `${resourceNameTodo}Detail`

  return new Function(scope, functionNameTodoDetail, {
    functionName: functionNameTodoDetail,
    code: new AssetCode(`./src/functions/todos/detail`),
    ...defaultOptions()
  });
}
