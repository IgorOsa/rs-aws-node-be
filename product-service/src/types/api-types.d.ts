export interface ProductResource {
    id: string;
    title: string;
    description: string;
    price: number;
    count: number;
}

export interface StocksResource {
    product_id: string;
    count: number;
}

export interface CreateProductBody {
    title: string;
    description: string;
    price: number;
    count: number;
}