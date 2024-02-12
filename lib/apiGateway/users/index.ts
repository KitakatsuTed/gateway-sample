import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { functionUserDetail, functionUserUpdate } from '../../lambda/users';
import { RouteMapping } from '../routes';
import { IamRoles } from '../../iamRole';

export const resourceNameUser = 'users'

export const defineApiGatewayUser = (scope: Construct, route: RouteMapping, iamRoles: IamRoles): void => {
  route.apiUser.addMethod(
    'GET',
    new LambdaIntegration(functionUserDetail(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.id': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'PATCH',
    new LambdaIntegration(functionUserUpdate(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.id': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );
}
