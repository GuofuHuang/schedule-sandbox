export interface systemOption {
    _id?: string;
    name: string;
    value: value[]
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}

interface value {
}