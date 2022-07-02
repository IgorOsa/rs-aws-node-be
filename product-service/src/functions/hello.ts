import { Handler } from 'aws-lambda';

export const hello: Handler = (event: any) => {
  console.log(`Incoming event: ${JSON.stringify(event)}`);

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

export default hello