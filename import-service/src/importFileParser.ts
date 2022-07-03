import csv from 'csv-parser';
import { Readable } from 'stream';
import { S3Client, GetObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.BUCKET;
const region = process.env.REGION;

const s3 = new S3Client({ region });

export const importFileParser = async (event) => {
    event.Records.forEach(async (record) => {
        const response = await s3.send(new GetObjectCommand({
            Bucket: BUCKET,
            Key: record.s3.object.key
        }));

        const s3Stream = response.Body as Readable;

        s3Stream.pipe(csv())
            .on('data', (data) => {
                console.log(data);
            })
            .on('end', async () => {
                console.log(`Copy from ${BUCKET}/${record.s3.object.key}`);

                await s3.send(new CopyObjectCommand({
                    Bucket: BUCKET,
                    CopySource: `${BUCKET}/${record.s3.object.key}`,
                    Key: record.s3.object.key.replace('uploaded', 'parsed')
                }));

                console.log(`Copied into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
            });
    });
}

export default importFileParser;