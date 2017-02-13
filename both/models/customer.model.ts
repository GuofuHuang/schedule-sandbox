import {DateTime} from "ionic-angular";
export interface Customer {
  _id?: string;
  customer: string;
  name: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zipCode: string;
  contractId: string;
  phone: string;
  phoneExtension: string;
  tax: string;
  email: string;
  currentDue: Date;
}