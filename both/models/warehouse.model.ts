export interface Warehouse {
  _id?: string;
  warehouse: string;
  description: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: number;
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
  removed: boolean;
} 
