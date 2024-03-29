import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Handler } from 'aws-lambda';
import { errorResponse, successResponse } from "./utils/responseHandler";

const BUCKET = process.env.BUCKET;
const region = process.env.REGION;

const s3 = new S3Client({ region });

export const importProductsFile: Handler = async (event) => {
    try {
        const fileName = event.queryStringParameters.name;
        const filePath = `uploaded/${fileName}`;

        const params = {
            Bucket: BUCKET,
            Key: filePath
        };
        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(s3, command, {
            expiresIn: 3000
        })

        return successResponse(url);
    } catch (error) {
        return errorResponse(error);
    }
}

export default importProductsFile;