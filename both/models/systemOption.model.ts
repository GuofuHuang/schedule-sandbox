export interface systemOption {
    _id?: string;
    name: string;
    value: value[]
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
    removed: boolean;
    tenantId: string;
}

interface value {
}
