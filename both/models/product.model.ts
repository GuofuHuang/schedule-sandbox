export interface Product {
    _id?: string;
    product: string;
    description: string;
    allowCustomerContract: boolean;
    allowCustomerQuote: boolean;
    categoryID: string;
    price: number;
    cost: number;
    warehouses: warehouses[];
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}

interface warehouses {
    warehouse: string;
    qtyOnHand: number;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
}