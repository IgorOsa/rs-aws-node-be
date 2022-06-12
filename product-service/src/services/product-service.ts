const products: ProductResource[] = [
    {
        id: 'prod0001',
        title: 'Windows 10 Home',
        description: 'License for Windows 10 Home',
        price: 149.99
    },
    {
        id: 'prod0002',
        title: 'Windows 10 Professional',
        description: 'License for Windows 10 Professional',
        price: 199.99
    },
    {
        id: 'prod0003',
        title: 'Windows 11 Home',
        description: 'License for Windows 11 Home',
        price: 199.99
    },
    {
        id: 'prod0004',
        title: 'Windows 11 Professional',
        description: 'License for Windows 11 Professional',
        price: 249.99
    },
    {
        id: 'prod0005',
        title: 'MS Office 2022 Home',
        description: 'Lifetime License for MS Office 2022 Home',
        price: 149.99
    },
    {
        id: 'prod0006',
        title: 'MS Office 2022 Professional',
        description: 'Lifetime License for MS Office 2022 Home',
        price: 249.99
    }
];

export default {
    getAll: async () => products,
    getById: async (id: string) => products.find(el => el.id === id)
}

export interface ProductService {
    getAll(): Promise<ProductResource[]>,
    getById(productId: string): Promise<ProductResource>
}

export interface ProductResource {
    id: string;
    title: string;
    description: string;
    price: number;
}