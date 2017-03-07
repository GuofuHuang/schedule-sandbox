export interface CustomerOrder {
  _id?: string;
  number : string;
  type : string;
  status : string;
  date : Date;
  promiseDate : null;
  scheduleDate : null;
  shipDate : Date;
  customerID : string;
  customerPONumber : string;
  billToName : string;
  billToAddress1 : string;
  billToAddress2 : string;
  billToAddress3 : string;
  billToCity : string;
  billToState : string;
  billToZipCode : string;
  shipToName : string;
  shipToAddress1 : string;
  shipToAddress2 : string;
  shipToAddress3 : string;
  shipToCity : string;
  shipToState : string;
  shipToZipCode : string;
  shipMethod : string;
  notes : string;
  salespeople: salespeople[];
  lineItems: lineItems[];
  createdUserID: string;
  createdDate: Date;
  updatedUserID: string;
  updatedDate: Date;
  tenantId: string;
}

interface salespeople {
  userID: string;
  commissionPercent: number;
}

interface lineItems {
  _id : string;
  sequence : number;
  type : string;
  status : string;
  description : string;
  promiseDate : null;
  dropShipment : boolean;
  productID : string;
  categoryID : string;
  price : number;
  cost : number;
  qtyOrdered : number;
  qtyBackordered : number;
  qtyShipped : number;
  total : number;
  notes : string;
  createdUserID : string;
  createdDate : Date;
  updatedUserID : string;
  updatedDate : Date;
}