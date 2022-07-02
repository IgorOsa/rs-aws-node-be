import { Handler } from 'aws-lambda';
import schema from '../schemas/createProductValidation';
import productService from '../services/product-service';
import { errorResponse, successResponse } from '../utils/responseHandler';

export const getProductsById: Handler = async (event: any) => {
    try {
        console.log(`Incoming event: ${JSON.stringify(event)}`);

        const product = JSON.parse(event.body);

        const { value, error } = schema.validate(product);

        if (error) {
            return errorResponse(error, 400);
        }

        const result = await productService.create(product);

        return successResponse(result, 201);
    } catch (error) {
        return errorResponse(error);
    }
}

export default getProductsById;