import { Construct } from "constructs";
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionTodoIndex = (scope: Construct) => {
  const functionNameTodoIndex = `${resourceNameTodo}Index`
  
  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameTodoIndex, {
    ...defaultOptions(),
    functionName: functionNameTodoIndex,
    entry: path.join(__dirname, '../../../src/functions/todos/index/handler.ts')
  });
}
