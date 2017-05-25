export interface Product {
    _id?: string;
    product: string;
    description: string;
    allowCustomerContract: boolean;
    allowCustomerQuote: boolean;
    categoryId: string;
    price: number;
    cost: number;
    warehouses: warehouses[];
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
    removed: boolean;
    tenantId: string;
}

interface warehouses {
    warehouse: string;
    qtyOnHand: number;
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
}
