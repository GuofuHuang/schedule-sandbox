export interface Role {
    _id?: string;
    name: string;
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
    removed: boolean;
    tenantId: string;
}
