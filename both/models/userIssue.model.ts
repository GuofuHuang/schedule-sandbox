export interface UserIssue {
    _id?: string;
    url: string;
    description: string;
    userId: string;
    deviceInfo: string;
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
    removed: boolean;
    tenantId: string;
}
