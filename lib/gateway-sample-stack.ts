import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { restApi } from './apiGateway/restApi';
import { defineApiGatewayTodo } from './apiGateway/todos';
import { buildRoutes } from './apiGateway/routes';

export class GatewaySampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApiObj = restApi(this)
    const router = buildRoutes(restApiObj)

    defineApiGatewayTodo(this, router)
  }
}
