exports.handler = async (event, err) => {
  console.log("input:", JSON.stringify(event, undefined, 2));
  // return response back to upstream caller
  return sendRes(200, "You have connected with the Lambda!");
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
