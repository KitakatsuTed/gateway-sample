import { Construct } from "constructs";
import { resourceNameUserAccount } from '../../apiGateway/userAccounts';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionUserAccountCreate = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserAccountCreate = `${resourceNameUserAccount}Create`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserAccountCreate, {
    ...defaultOptions,
    functionName: functionNameUserAccountCreate,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/userAccounts/create/handler.ts')
  });
}
