export interface systemAlert {
    _id: string;
    name: string;
    tenantId: string;
    deleted: boolean;
    active: boolean;
    from: string;
    to: string;
    cc: string;
    bcc: string;
    attachments: {};
    subject: string;
    body: string;
    schedule: {};
    method: {};
    createdUserId: string;
    createdAt: Date;
    updatedUserId: string;
    updatedAt: Date;
}
