import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const region = process.env.REGION || 'eu-west-1';
const QueueUrl = process.env.SQS_URL;

const sqs = new SQSClient({ region });

export const catalogBatchProcess = async (event) => {
    console.log(event.Records);

    for (const message of event.Records) {
        console.log(message);

        const { receiptHandle, body } = message;

        const deleteResult = await sqs.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: receiptHandle }));

        console.log('Message deleted:', deleteResult);

        console.log('Adding product:', body);

        // todo post product to db
    }
}

export default catalogBatchProcess;
