export interface CustomerMeeting {
    _id?: string;
    dateTime: string;
    customerID: string;
    createdDateTime: Date;
    status: string;
    branch: string;
    createdUserId: string;
    createdAt: Date;
    removed: boolean;
    tenantId: string;
}
