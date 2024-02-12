import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { RouteMapping } from '../routes';
import { IamRoles } from '../../iamRole';
import { functionUserAccountDelete, functionUserAccountUpdate } from '../../lambda/userAccounts';

export const resourceNameUserAccount = 'userAccount'

export const defineApiGatewayUserAccount = (scope: Construct, route: RouteMapping, iamRoles: IamRoles): void => {
  route.apiUserAccount.addMethod(
    'PATCH',
    new LambdaIntegration(functionUserAccountUpdate(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.id': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUserAccount.addMethod(
    'DELETE',
    new LambdaIntegration(functionUserAccountDelete(scope, iamRoles.lambdaBasicRole)),
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
