export interface SystemTenant {
    _id?: string;
    name: string;
    logo: string;
    scheme: string;
    address1: string;
    numberOfUsers: string;
    subdomain: string;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}