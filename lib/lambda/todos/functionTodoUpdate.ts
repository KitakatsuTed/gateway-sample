import { Construct } from "constructs";
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
import { iamRoles } from "../../iamRole";
export const functionTodoUpdate = (scope: Construct) => {
  const functionNameTodoUpdate = `${resourceNameTodo}Update`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameTodoUpdate, {
    ...defaultOptions,
    functionName: functionNameTodoUpdate,
    role: iamRoles(scope).lambdaBasicRole,
    entry: path.join(__dirname, '../../src/functions/todos/update/handler.ts')
  });
}
