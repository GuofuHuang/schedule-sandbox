export interface UserGroup {
    _id?: string;
    name: string;
    permissions: {};
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}
