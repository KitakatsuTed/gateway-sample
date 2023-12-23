import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { functionTodoDetail, functionTodoIndex } from '../../lambda/todos';
import { RouteMapping } from '../routes';
import { functionTodoDelete } from '../../lambda/todos/functionTodoDelete';
import { functionTodoCreate } from '../../lambda/todos/functionTodoCreate';
import { functionTodoUpdate } from '../../lambda/todos/functionTodoUpdate';
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
    new LambdaIntegration(functionTodoDetail(scope)),
    {
      requestParameters: {
        'method.request.path.id': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'GET',
    new LambdaIntegration(functionTodoCreate(scope)),
    {
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'GET',
    new LambdaIntegration(functionTodoUpdate(scope)),
    {
      requestParameters: {
        'method.request.path.id': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'GET',
    new LambdaIntegration(functionTodoDelete(scope)),
    {
      requestParameters: {
        'method.request.path.id': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );
}
