import { Handler } from 'aws-lambda';
import productService from '../services/product-service';

export const getProductsById: Handler = async (event: any) => {
  const { productId } = event.pathParameters;
  let statusCode = 200;
  let result = await productService.getById(productId);
  let body: string;

  if (!!result) {
    body = JSON.stringify(result);
  } else {
    statusCode = 404;
    body = JSON.stringify({
      message: `Product with id "${productId}" not found`
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