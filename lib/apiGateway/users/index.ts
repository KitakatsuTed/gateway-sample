import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { functionUserCreate, functionUserDelete, functionUserDetail, functionUserIndex, functionUserUpdate } from '../../lambda/users';
import { RouteMapping } from '../routes';
import { IamRoles } from '../../iamRole';

export const resourceNameUser = 'users'

export const defineApiGatewayUser = (scope: Construct, route: RouteMapping, iamRoles: IamRoles): void => {
  //リソースにGETメソッド、Lambda統合プロキシを指定
  route.apiUsers.addMethod(
    'GET',
    new LambdaIntegration(functionUserIndex(scope, iamRoles.lambdaBasicRole))
  );

  route.apiUser.addMethod(
    'GET',
    new LambdaIntegration(functionUserDetail(scope, iamRoles.lambdaBasicRole)),
    {
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'POST',
    new LambdaIntegration(functionUserCreate(scope, iamRoles.lambdaBasicRole)),
    {
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'PATCH',
    new LambdaIntegration(functionUserUpdate(scope, iamRoles.lambdaBasicRole)),
    {
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'DELETE',
    new LambdaIntegration(functionUserDelete(scope, iamRoles.lambdaBasicRole)),
    {
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );
}
