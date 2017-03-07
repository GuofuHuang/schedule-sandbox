export interface CustomerBranch {
    _id?: string;
    customerID: string;
    CustomerName: string;
    shipTo: string;
    name: string;
    address1: string;
    address2: string;
    address3: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    phoneExtension: string;
    fax: string;
    email: string;
    salespeople: salespeople[];
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}

interface salespeople {
}