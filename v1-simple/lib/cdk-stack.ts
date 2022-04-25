import { aws_lambda, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class CdkSimpleWebserviceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    let lambdaName = "simplest-lambda";
    const memorySize = 512;
    const simplestLambda = new aws_lambda.Function(this, lambdaName, {
      functionName: lambdaName,
      description: "Simplest webservice integration",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      memorySize: memorySize,
      timeout: Duration.seconds(30),
      code: aws_lambda.Code.fromAsset(
        `${process.cwd()}/functions/simplest-example`,
        {}
      ),
      handler: "index.handler",
      environment: {},
      retryAttempts: 0, // No async exec
    });
    // defines an API Gateway Http API resource backed by our "simplestLambda" function.
    const lambdaIntegration = new HttpLambdaIntegration(
      "lambdaIntegration",
      simplestLambda
    );
    const apiName = "my-cdk-simple-webservice-v1";
    new HttpApi(this, apiName, {
      apiName: apiName,
      defaultIntegration: lambdaIntegration,
      description: "My cdk simple webservice",
    });
  }
}
