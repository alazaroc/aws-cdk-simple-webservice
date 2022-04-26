# CDK Simple webservice

This repository contains several CDK projects and it have been created and explained in this post:

<https://www.playingaws.com/posts/how-to-create-serverless-applications-with-cdk-and-sam>.

## v1

This is the simplest version of the webservice

![simple-webservice-v1](v1-simple/simple-webservice-v1.png)

## v2

In this version, a DynamoDB table has been added to the Lambda Function

![simple-webservice-v2](v2-dynamodb/simple-webservice-v2.png)

Challenge: Test DynamoDB locally with SAM

## v3

In this version, the Lambda Function also connects with an external API

![simple-webservice-v3](v3-dynamodb-and-external-api/simple-webservice-v3.png)

Challenge: deploy my nodejs Lambda Function with an external library (requests)
