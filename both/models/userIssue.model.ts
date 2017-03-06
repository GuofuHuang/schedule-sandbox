export interface UserIssue {
    _id?: string;
    url: string;
    description: string;
    userId: string;
    deviceInfo: string;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}