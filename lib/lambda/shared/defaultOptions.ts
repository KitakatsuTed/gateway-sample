import { Runtime } from "aws-cdk-lib/aws-lambda"
import * as cdk from 'aws-cdk-lib';
import path from "path";

export const defaultOptions = () => {
  return {
    handler: "index.handler",
    runtime: Runtime.NODEJS_20_X,
    memorySize: 512,
    timeout: cdk.Duration.seconds(10),
    bundling: {
      minify: true,
      sourceMap: true,
      externalModules: ["@aws-sdk/*"],
      tsconfig: path.join(__dirname, "../../tsconfig.json"),
      format: cdk.aws_lambda_nodejs.OutputFormat.ESM,
    },
  }
}