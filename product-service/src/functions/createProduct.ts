import { Handler } from 'aws-lambda';
import productService from '../services/product-service';

export const getProductsById: Handler = async (event: any) => {
    console.log(`Incoming event: ${JSON.stringify(event)}`);

    const product = JSON.parse(event.body);
    let statusCode = 201;
    let result = await productService.create(product);
    let body: string;

    if (!!result) {
        body = JSON.stringify(result);
    } else {
        statusCode = 400;
        body = JSON.stringify({
            message: `Error creating product`
        });
    }
    const response = {
        statusCode,
        headers: {
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        body,
    };

    return new Promise((resolve) => {
        resolve(response)
    })
}

export default getProductsById;