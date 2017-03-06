export interface CustomerMeeting {
    _id?: string;
    dateTime: string;
    customerID: string;
    createdDateTime: Date;
    status: string;
    branch: string;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}