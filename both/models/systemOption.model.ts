export interface systemOption {
    _id?: string;
    name: string;
    value: value[]
    createdUserId: string;
    createdAt: Date;
    removed: boolean;
    tenantId: string;
}

interface value {
}
