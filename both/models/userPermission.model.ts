export interface UserPermission {
    _id?: string;
    name: string;
    description: string;
    tenantId: string;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
}