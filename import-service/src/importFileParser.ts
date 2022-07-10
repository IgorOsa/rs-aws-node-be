import csv from 'csv-parser';
import { Readable } from 'stream';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.BUCKET;
const region = process.env.REGION;

const s3 = new S3Client({ region });

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

        const s3StreamProcessor = (stream) => {
            return new Promise((resolve, reject) => {
                stream
                    .pipe(csv())
                    .on('error', (err) => reject(err))
                    .on('data', (data) => {
                        console.log(data);
                    })
                    .on('end', async () => {
                        console.log(`Copy from ${Bucket}/${Key}`);

                        await s3.send(new CopyObjectCommand({
                            Bucket,
                            CopySource: `${Bucket}/${Key}`,
                            Key: Key.replace('uploaded', 'parsed')
                        })).catch((err) => console.log(err));

                        console.log(`Moved to ${Bucket}/${Key.replace('uploaded', 'parsed')}`);

                        await s3.send(new DeleteObjectCommand({
                            Bucket,
                            Key: record.s3.object.key
                        })).catch((err) => console.log(err));

                    });
            })
        }

        await s3StreamProcessor(s3Stream);
    }
}

export default importFileParser;