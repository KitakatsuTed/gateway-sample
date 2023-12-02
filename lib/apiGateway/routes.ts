import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { resourceNameTodo } from "./todos";
import { Resource } from "aws-cdk-lib/aws-apigateway/lib";

export type RouteMapping = Record<string, Resource>

export const buildRoutes = (restApi: RestApi): RouteMapping => {
  const apiTodos = restApi.root.addResource(resourceNameTodo);
  const apiTodo = apiTodos.addResource('{todoId}')

  return {
    apiTodos,
    apiTodo
  }
}