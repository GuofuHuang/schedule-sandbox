export interface Vendor {
    _id?: string;
    vendor: string;
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
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
}