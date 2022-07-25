export const basicAuthorizer = async (event: any, context: any, callback: any) => {
  console.log('EVENT:', JSON.stringify(event, null, 2));

  const token = event.authorizationToken;

  console.log('TOKEN:', token);
  
  const [userName, password] = decryptToken(token);

  if (userName && password && process.env[userName] === password) {
    return callback(null, generatePolicy(userName, 'Allow', event.methodArn));
  }
  else {
    return callback(null, generatePolicy(userName, 'Deny', event.methodArn));
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

const decryptToken = (token: string) => { 
  const decoded = Buffer.from(token.split(' ')[1], 'base64').toString('utf-8');
  
  console.log('DECODED TOKEN:', decoded);
  
  const [userName, password] = decoded.split(':');

  return [userName, password];
}

export default basicAuthorizer;
