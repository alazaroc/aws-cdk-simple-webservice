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

export class CdkSimpleWebserviceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //DynamoDB Table
    const tableName = "hits";
    const table = new aws_dynamodb.Table(this, tableName, {
      tableName: tableName,
      partitionKey: {
        name: "path",
        type: aws_dynamodb.AttributeType.STRING,
      },
    });

    // defines an AWS Lambda resource
    let lambdaName = "dynamodb-lambda";
    const memorySize = 512;
    const dynamoLambda = new aws_lambda.Function(this, lambdaName, {
      functionName: lambdaName,
      description: "Simple webservice integration (with DynamoDB)",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      memorySize: memorySize,
      timeout: Duration.seconds(30),
      code: aws_lambda.Code.fromAsset(
        `${process.cwd()}/functions/dynamodb-example`,
        {}
      ),
      handler: "index.handler",
      environment: {
        HITS_TABLE_NAME: tableName,
      },
      retryAttempts: 0, // No async exec
    });
    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(dynamoLambda);

    // defines an API Gateway Http API resource backed by our "dynamoLambda" function.
    const dynamoLambdaIntegration = new HttpLambdaIntegration(
      "dynamoLambdaIntegration",
      dynamoLambda
    );
    const apiName = "my-cdk-simple-webservice-v2";
    new HttpApi(this, apiName, {
      apiName: apiName,
      defaultIntegration: dynamoLambdaIntegration,
      description: "My cdk simple webservice",
    });
  }
}
