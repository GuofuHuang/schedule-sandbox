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
  fax: string;
  email: string;
  currentDue: number;
  pastDue1: number;
  pastDue2: number;
  pastDue3: number;
  pastDue4: number;
  shipToAddresses: shipToAddresses[];
  salespeople: salespeople[];
  customerContacts: customerContacts[];
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
  removed: boolean;
  tenantId: string;
}

interface shipToAddresses {
  shipTo: string;
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
  fax: string;
  email: string;
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
  salespeople: salespeople[];
}

interface salespeople {
}

interface customerContacts {
  description: string;
  name: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zipCode: string;
  fax: string;
  notes: string;
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
  customerContactEmails: null;
  customerContactPhoneNumbers: null;
}
