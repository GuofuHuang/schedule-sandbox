export interface SystemLookup {
  _id?: string;
  name: string;
  collection: string;
  label: string; // this is used by the dialog-system-lookup
  searchable: boolean;
  lookupType: string; // type of this system lookup, including fieldUpdate, single and multi
  single?: Single;
  multi?: Multi;
  dataTable: DataTable;
  createdUserId: string;
  createdAt: Date;
  updatedUserId: string;
  updatedAt: Date;
}

interface Multi {
  pipeline?: any; // used to store aggregation pipeline
}

interface Single {
  updateField: string; // only used for fieldUpdate type
  findOptions: any; // equal to the options in query, for instance: find({}, options)
  returnData: any[]; // used to formate the output, example: ['customer', ' - ', 'name']
}

interface DataTable {
  table: any; // options for table
  columns: {}[]; // options for columns
  rows: any; // options for rows
}

interface findOptions {
  fields: {}; // example: {username: 1, email: 1}
  sort: {}; // example: {username: 1}
  limit: number;
}