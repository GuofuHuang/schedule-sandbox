export interface Categories {
    _id?: string;
    category: string;
    allowCustomerContract: boolean;
    allowCustomerQuote: boolean;
    priceLevel1Percent: number;
    priceLevel2Percent: number;
    priceLevel3Percent: number;
    priceLevel4Percent: number;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
    tenantId: string;
}