import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import schema from "../schemas/createProductValidation";
import productService from '../services/product-service';
import { errorResponse, successResponse } from "../utils/responseHandler";


const region = process.env.REGION || 'eu-west-1';
const QueueUrl = process.env.SQS_URL;

const sqs = new SQSClient({ region });

export const catalogBatchProcess = async (event) => {
    console.log(event.Records);

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

            return successResponse(result, 201);
        } catch (error) {
            console.log(error);
            return errorResponse(error, 400);
        }
    }
}

export default catalogBatchProcess;
