const AWS = require("aws-sdk");

// create AWS SDK clients
const dynamo = new AWS.DynamoDB();

if (process.env.AWS_SAM_LOCAL) {
  // mac
  dynamo.endpoint = new AWS.Endpoint("http://docker.for.mac.localhost:8000/");
  // windows
  // dynamo.endpoint = new AWS.Endpoint("http://docker.for.windows.localhost:8000/");
  // linux
  // dynamo.endpoint = new AWS.Endpoint("http://127.0.0.1:8000");
}

exports.handler = async (event, err) => {
  console.log("input:", JSON.stringify(event, undefined, 2));

  // update dynamo entry for "path" with hits++
  await dynamo
    .updateItem({
      TableName: process.env.HITS_TABLE_NAME,
      Key: { path: { S: event.rawPath } },
      UpdateExpression: "ADD hits :incr",
      ExpressionAttributeValues: { ":incr": { N: "1" } },
    })
    .promise();

  console.log("inserted counter for " + event.rawPath);

  // return response back to upstream caller
  return sendRes(
    200,
    "You have connected with the Lambda and store the data in the DynamoDB table!"
  );
};

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "text/html",
    },
    body: body,
  };
  return response;
};
