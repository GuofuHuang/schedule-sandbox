export interface salespersonTerritory {
    _id?: string;
    customer: string;
    city: string;
    state: string;
    salespeople: [salespeople];
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}

interface salespeople {
    userID: string;
    commissionPercent: number;
}