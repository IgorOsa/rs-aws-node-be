import csv from 'csv-parser';
import { Readable } from 'stream';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const BUCKET = process.env.BUCKET;
const region = process.env.REGION || 'eu-west-1';
const SQS_URL = process.env.SQS_URL;

const s3 = new S3Client({ region });
const sqs = new SQSClient({ region });

export const importFileParser = async (event) => {
    console.log(event);

    for (let record of event.Records) {
        console.log(record);

        const Bucket = record.s3.bucket.name;
        const Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

        const response = await s3.send(new GetObjectCommand({
            Bucket,
            Key
        }));

        const s3Stream = response.Body as Readable;

        const s3StreamProcessor = (stream: Readable) => {
            return new Promise(async (resolve, reject) => {
                const results = [];

                stream
                    .pipe(csv({
                        separator: ';',
                        headers: ['title', 'description', 'price', 'count'],
                        skipLines: 1
                    }))
                    .on('error', (err) => reject(err))
                    .on('data', (data) => results.push(data as never))
                    .on('end', async () => {
                        console.log(results);
                        resolve(results);
                    });

                // 
            })
        }

        try {
            const data = await s3StreamProcessor(s3Stream);

            console.log('Prepare data form sending to SQS:', data);

            try {
                for (const item of data as any) {
                    const sqsResult = await sqs.send(new SendMessageCommand({
                        QueueUrl: SQS_URL,
                        MessageBody: JSON.stringify(item)
                    }));
                    console.log(`Message ${sqsResult.MessageId} sent`);
                }
            } catch (error) {
                console.log('Error sending messages to SQS', error);
                return null;
            }

            console.log(`Copy from ${Bucket}/${Key}`);

            await s3.send(new CopyObjectCommand({
                Bucket,
                CopySource: `${Bucket}/${Key}`,
                Key: Key.replace('uploaded', 'parsed')
            }))

            console.log(`Moved to ${Bucket}/${Key.replace('uploaded', 'parsed')}`);

            await s3.send(new DeleteObjectCommand({
                Bucket,
                Key: record.s3.object.key
            }))
        } catch (error) {
            console.log(error);
        }

    }
}

export default importFileParser;
