import {
  aws_dynamodb,
  aws_lambda,
  Duration,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class CdkSimpleWebserviceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //DynamoDB Table
    const tableName = "hits-v3";
    const table = new aws_dynamodb.Table(this, tableName, {
      tableName: tableName,
      partitionKey: {
        name: "path",
        type: aws_dynamodb.AttributeType.STRING,
      },
    });

    // defines an AWS Lambda resource
    let lambdaName = "dynamodb-and-external-api-lambda";
    const memorySize = 512;
    const dynamoLambda = new NodejsFunction(this, lambdaName, {
      functionName: lambdaName,
      description: "Simple webservice with external api integration",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      memorySize: memorySize,
      timeout: Duration.seconds(30),
      entry: "functions/dynamodb-example/index.js", // accepts .js, .jsx, .ts, .tsx and .mjs files
      handler: "handler", // defaults to 'handler'
      retryAttempts: 0, // No async exec,
      bundling: {
        minify: false, // minify code, defaults to false
        nodeModules: ["request"],
      },
      environment: {
        HITS_TABLE_NAME: tableName,
      },
    });
    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(dynamoLambda);

    // defines an API Gateway Http API resource backed by our "dynamoLambda" function.
    const dynamoLambdaIntegration = new HttpLambdaIntegration(
      "dynamoLambdaIntegration",
      dynamoLambda
    );
    const apiName = "my-cdk-simple-webservice-v3";
    new HttpApi(this, apiName, {
      apiName: apiName,
      defaultIntegration: dynamoLambdaIntegration,
      description: "My cdk simple webservice",
    });
  }
}
