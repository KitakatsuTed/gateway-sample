import { Construct } from "constructs";
import { resourceNameUser } from '../../apiGateway/users';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionUserIndex = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserIndex = `${resourceNameUser}Index`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserIndex, {
    ...defaultOptions,
    functionName: functionNameUserIndex,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/users/index/handler.ts')
  });
}
