export interface SystemLookup {
  _id?: string;
  name: string;
  collection: string;
  label: string;
  searchable: boolean;
  // pipeline?: any; // this is only used for multiple collections lookup
  // findOptions?: any; // this is only used for single collection lookup
  // dataTableOptions: any; // define data table options
  // dataTableColumns: any; // define column properties fro data table.
  // returnedFields?: any[]; // this is used only for single collection lookup
  single?: Single;
  multi?: Multi;
  dataTable: DataTable;
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
}

interface Multi {
  pipeline?: any;
}

interface Single {
  findOptions: any;
  returnedFields: any[];
}

interface DataTable {
  tableOptions: any;
  columnOptions: any;
  rowOptions: any;
}

interface findOptions {
    fields: fields[];
    sort: sort[];
    limit: number;
}

interface dataTableOptions {
    _id?: string;
    sequence: number;
    type: string;
    status: string;
    description: string;
    requiredDate: Date;
    productID: string;
    categoryID: string;
    cost: number;
    qtyOrdered: number;
    qtyBackordered: number;
    qtyReceived: number;
    total: number;
    notes: string;
    createdUserID: string;
    createdDate: Date;
    updatedUserID: string;
    updatedDate: Date;
}

interface fields {
    category: number;
    description: number;
}

interface sort {
    category: number;
}