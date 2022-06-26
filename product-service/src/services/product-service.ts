import dbClient from "./../db-client";
import { CreateProductBody, ProductResource, StocksResource } from "../types/api-types";
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
    },
    create: async (product: CreateProductBody) => {
        try {
            await dbClient.query(`BEGIN`);
            const query = {
                text: `INSERT INTO ${tableName} (title, description, price) VALUES($1, $2, $3) RETURNING *`,
                values: [product.title, product.description, product.price],
            };
            const productEntity = await dbClient.query(query);

            if (!productEntity) throw new Error("Error creating product");

            const queryStocks = {
                text: `INSERT INTO ${subTableName}(product_id, count) VALUES($1, $2) RETURNING count`,
                values: [productEntity.rows[0].id, product.count],
            };

            const stocksEntity = await dbClient.query(queryStocks);

            if (!stocksEntity) throw new Error("Error creating stock value");

            await dbClient.query(`COMMIT`);

            const result = { ...productEntity.rows[0], count: stocksEntity.rows[0].count }

            return result ? result : null;
        } catch (error) {
            dbClient.query(`ROLLBACK`);
            throw new Error(error.message);
        }
    }
}

export interface ProductService {
    getAll(): Promise<ProductResource[]>,
    getById(productId: string): Promise<ProductResource>,
    create(product: CreateProductResource): Promise<ProductResource>
}
