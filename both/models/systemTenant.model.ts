export interface SystemTenant {
  _id?: string;
  name: string;
  logo: string;
  scheme: string;
  address: string;
  address1: string;
  city: string;
  state: string;
  zipCode: number;
  numberOfUsers: number;
  subDomain: string;
  parentTenantId: string;
  modules: string[];
  userId: string;
  createdUserId: string;
  createdAt: Date;
  removed: boolean;
  default: boolean;
}