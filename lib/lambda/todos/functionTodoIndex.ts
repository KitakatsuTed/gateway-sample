import { Construct } from "constructs";
import { Function, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';
export const functionTodoIndex = (scope: Construct) => {
  const functionNameTodoIndex = `${resourceNameTodo}Index`
  
  return new Function(scope, functionNameTodoIndex, {
    functionName: functionNameTodoIndex,
    code: new AssetCode(`./src/functions/todos/index`),
    ...defaultOptions()
  });
}
