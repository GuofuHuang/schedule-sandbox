export interface salespersonTerritory {
    _id?: string;
    customer: string;
    city: string;
    state: string;
    salespeople: [salespeople];
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
    removed: boolean;
    tenantId: string;
}

interface salespeople {
    userID: string;
    commissionPercent: number;
}
