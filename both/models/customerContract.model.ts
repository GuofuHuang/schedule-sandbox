export interface CustomerContract {
    _id?: string;
    categories: categories[];
    products: products[];
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}

interface products {
    productID: string;
    contractPrices: contractPrices[]
}

interface categories {
}

interface contractPrices {
    _id: string;
    price: number;
    effectiveDate: Date;
    minOrderQty: number;
    deleted: boolean;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}