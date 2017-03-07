export interface SystemLookup {
    _id?: string;
    name: string;
    collection: string;
    label: string;
    searchable: boolean;
    findOptions: findOptions[];
    dataTableOptions: dataTableOptions[];
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
}

interface findOptions {
    fields: fields[];
    sort: sort[];
    limit: number;
}

interface dataTableOptions {
    _id?: string;
    sequence: number;
    type: string;
    status: string;
    description: string;
    requiredDate: Date;
    productID: string;
    categoryID: string;
    cost: number;
    qtyOrdered: number;
    qtyBackordered: number;
    qtyReceived: number;
    total: number;
    notes: string;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
}

interface fields {
    category: number;
    description: number;
}

interface sort {
    category: number;
}