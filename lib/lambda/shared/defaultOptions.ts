import { FunctionProps, Runtime } from "aws-cdk-lib/aws-lambda"
import * as cdk from 'aws-cdk-lib';

export const defaultOptions = (args?: FunctionProps) => {
  return {
    handler: "handler.handler",
    runtime: Runtime.NODEJS_20_X,
    memorySize: 512,
    timeout: cdk.Duration.seconds(10),
    ...{args}
  }
}