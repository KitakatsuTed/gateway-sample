import { Construct } from "constructs";
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';
import path from "path";
import * as cdk from 'aws-cdk-lib';

export const functionTodoDelete = (scope: Construct) => {
  const functionNameTodoDelete = `${resourceNameTodo}Delete`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameTodoDelete, {
    ...defaultOptions,
    functionName: functionNameTodoDelete,
    entry: path.join(__dirname, '../../src/functions/todos/delete/handler.ts')
  });
}
