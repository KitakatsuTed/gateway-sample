import { Construct } from "constructs";
import { resourceNameTodo } from '../apiGateway/todos';
import { defaultOptions } from '../lambda/shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
import { iamRoles } from "../iamRole";
export const functionTodoIndex = (scope: Construct) => {
  const functionNameTodoIndex = `${resourceNameTodo}Index`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameTodoIndex, {
    ...defaultOptions,
    functionName: functionNameTodoIndex,
    role: iamRoles(scope).lambdaBasicRole,
    entry: path.join(__dirname, '../../src/functions/todos/index/handler.ts')
  });
}
