import { Handler } from 'aws-lambda';
import schema from '../schemas/getByIdValidation';
import productService from '../services/product-service';
import { errorResponse, successResponse } from '../utils/responseHandler';

export const getProductsById: Handler = async (event: any) => {
  try {
    console.log(`Incoming event: ${JSON.stringify(event)}`);

    const { productId } = event.pathParameters;
    const { error } = schema.validate(productId);

    if (error) {
      return errorResponse(error, 400);
    }

    const result = await productService.getById(productId);

    if (!result) {
      return errorResponse(new Error(`Product with id "${productId}" not found`), 404)
    }

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export default getProductsById;