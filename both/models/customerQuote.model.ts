export interface CustomerQuote {
  _id?: string;
  customerID : string;
  categoryID : string;
  notes : null;
  products : products;
  sync : boolean;
  status : string;
  adminNotes : null;
  createdUserID: string;
  createdDate: Date;
  updatedUserID: string;
  updatedDate: Date;
  tenantId: string;
}

interface products {
  price: string;
  productID: string;
  previousPrice: number;
  originalPrice: number;
  invoices: null;
}
