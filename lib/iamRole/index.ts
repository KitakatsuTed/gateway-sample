import * as cdk from 'aws-cdk-lib';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export const iamRoles = (scope: Construct) => {
  const lambdaBasicRole: Role = new cdk.aws_iam.Role(scope, 'lambda-basic-role', {
    assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [
      cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    ],
  })

  return {
    lambdaBasicRole
  }
}