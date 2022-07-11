import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import schema from "../schemas/createProductValidation";
import productService from '../services/product-service';
import { errorResponse, successResponse } from "../utils/responseHandler";


const region = process.env.REGION || 'eu-west-1';
const QueueUrl = process.env.SQS_URL;
const SNS_ARN = process.env.SNS_ARN;

const sqs = new SQSClient({ region });
const sns = new SNSClient({ region });

export const catalogBatchProcess = async (event) => {
    console.log(event.Records);
    const addedProducts = [];

    for (const message of event.Records) {
        console.log(message);

        try {
            const { receiptHandle, body } = message;

            const deleteResult = await sqs.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: receiptHandle }));

            console.log('Message deleted:', deleteResult);

            console.log('Adding product:', body);

            const { title, description, price, count } = JSON.parse(body);

            const product = {
                title: String(title),
                description: String(description) || '',
                price: Number(price) || 0,
                count: Number(count) || 0
            }

            const { value, error } = schema.validate(product);

            if (error) {
                throw error;
            }

            const result = await productService.create(product);

            addedProducts.push(product);

            console.log('Product creation result:', result);
        } catch (error) {
            console.log(error);
            return errorResponse(error, 400);
        }
    }

    try {
        const result = await sns.send(new PublishCommand({
            Subject: 'New product(s) added to DB',
            Message: JSON.stringify(addedProducts),
            TopicArn: SNS_ARN,
            // TargetArn: SNS_ARN,
        }))

        console.log('Message to SNS successfully sent', result);
    } catch (error) {
        console.log('Error sending message to SNS', error.message);
    }

    return successResponse('Catalog Batch Process Successful', 201);
}

export default catalogBatchProcess;
