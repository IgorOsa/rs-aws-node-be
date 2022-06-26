import { Handler } from 'aws-lambda';
import productService from '../services/product-service';

export const getProductsList: Handler = async () => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      await productService.getAll()
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

export default getProductsList;