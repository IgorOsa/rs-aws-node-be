import { Handler } from 'aws-lambda';
import productService from '../services/product-service';
import { errorResponse, successResponse } from '../utils/responseHandler';

export const getProductsList: Handler = async (event) => {
  try {
    console.log(`Incoming event: ${JSON.stringify(event)}`);

    const result = await productService.getAll();

    return successResponse(result, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export default getProductsList;