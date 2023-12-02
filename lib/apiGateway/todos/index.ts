import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { functionTodoDetail, functionTodoIndex } from '../../lambda/todos';
import { RouteMapping } from '../routes';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export const resourceNameTodo = 'todos'

export const defineApiGatewayTodo = (scope: Construct, route: RouteMapping): void => {
  //リソースにGETメソッド、Lambda統合プロキシを指定
  route.apiTodos.addMethod(
    'GET',
    new LambdaIntegration(functionTodoIndex(scope))
  );
  
  route.apiTodo.addMethod(
    'GET',
    new LambdaIntegration(functionTodoDetail(scope))
  );
}
