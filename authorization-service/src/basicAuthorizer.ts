export const basicAuthorizer = async (event: any, context: any, callback: any) => {
  console.log(event, context);
  // VEVTVF9QQVNTV09SRA==
  const token = event.authorizationToken;

  if (token == 'Basic VEVTVF9QQVNTV09SRA==') {
    return callback(null, generatePolicy('user', 'Allow', event.methodArn));
  }
  else {
    return callback(null, generatePolicy('user', 'Deny', event.methodArn));
  }
};

// Helper function to generate an IAM policy
const generatePolicy = function(principalId: string, Effect: string, Resource: any) {
  const authResponse = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action:'execute-api:Invoke',
          Effect,
          Resource,
        }
      ],
    }
  };

  return authResponse;
}

export default basicAuthorizer;
