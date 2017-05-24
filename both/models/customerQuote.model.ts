export interface CustomerQuote {
  _id?: string;
  customerID : string;
  categoryID : string;
  notes : null;
  products : products;
  sync : boolean;
  status : string;
  adminNotes : null;
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
  removed: boolean;
  tenantId: string;
}

interface products {
  price: string;
  productID: string;
  previousPrice: number;
  originalPrice: number;
  invoices: null;
}
