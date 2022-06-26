import dbClient from "./../db-client";
import { ProductResource } from "../types/api-types";
import { QueryConfig } from "pg";


const tableName = 'products';
const subTableName = 'stocks';

export default {
    getAll: async () => {
        const query = {
            text: `SELECT id, count, price, title, description FROM ${tableName} 
            LEFT JOIN ${subTableName} on ${tableName}.id=${subTableName}.product_id`,
        } as QueryConfig;

        const result = await dbClient.query(query);
        return result.rows ? result.rows : null;
    },
    getById: async (id: string) => {
        const query = {
            text: `SELECT id, count, price, title, description FROM ${tableName} 
            LEFT JOIN ${subTableName} on ${tableName}.id=${subTableName}.product_id 
            WHERE id = $1`,
            values: [id],
        } as QueryConfig;

        const result = await dbClient.query(query);
        return result.rows[0] ? result.rows[0] : null;
    }
}

export interface ProductService {
    getAll(): Promise<ProductResource[]>,
    getById(productId: string): Promise<ProductResource>
}
