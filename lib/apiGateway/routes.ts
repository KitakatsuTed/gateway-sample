import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { resourceNameTodo } from "./todos";
import { Resource } from "aws-cdk-lib/aws-apigateway/lib";
import { resourceNameUserAccount } from "./userAccounts";

export type RouteMapping = Record<string, Resource>

export const buildRoutes = (restApi: RestApi): RouteMapping => {
  const apiUserAccounts = restApi.root.addResource(resourceNameUserAccount);
  
  const apiUser = restApi.root.addResource(resourceNameUserAccount);

  const apiTodos = apiUser.addResource(resourceNameTodo);
  const apiTodo = apiTodos.addResource('{todoId}')

  return {
    apiUserAccounts,
    apiUser,
    apiTodos,
    apiTodo
  }
}