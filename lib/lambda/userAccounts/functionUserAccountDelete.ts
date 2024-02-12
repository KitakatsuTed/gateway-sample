import { Construct } from "constructs";
import { resourceNameUserAccount } from '../../apiGateway/userAccounts';
import { defaultOptions } from '../shared/defaultOptions';
import path from "path";
import * as cdk from 'aws-cdk-lib';

export const functionUserAccountDelete = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserAccountDelete = `${resourceNameUserAccount}Delete`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserAccountDelete, {
    ...defaultOptions,
    functionName: functionNameUserAccountDelete,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/userAccounts/delete/handler.ts')
  });
}
