export interface systemAlert {
    _id: string;
    name: string;
    tenantId: string;
    deleted: boolean;
    active: boolean;
    from: string;
    to [ ]: string;
    cc [ ]: string;
    bcc [ ]: string;
    attachments [ ]: {};
    subject: string;
    body: string;
    schedule: {};
    method: {};
    createdUserId: string;
    createdAt: date
    updatedUserId: string;
    updatedAt: date
}
