export interface TableRow {
  id: number;
  key: string;
  value: string;
}

export type TableType = TableRow[];

export type State = TableType[];

export const WELL_SUMMARRY_TABLE_EMPTY: TableType = [
  {
    id: 0,
    key: 'NO',
    value: '',
  },
  {
    id: 1,
    key: 'BA_LONG_NAME',
    value: '',
  },
  {
    id: 2,
    key: 'BA_TYPE',
    value: '',
  },
  {
    id: 3,
    key: 'AREA_ID',
    value: '',
  },
  {
    id: 4,
    key: 'AREA_TYPE',
    value: '',
  },
  {
    id: 5,
    key: 'FIELD_NAME',
    value: '',
  },
  {
    id: 6,
    key: 'WELL_NAME',
    value: '',
  },
  {
    id: 7,
    key: 'UWI',
    value: '',
  },
  {
    id: 8,
    key: 'TITLE',
    value: '',
  },
  {
    id: 9,
    key: 'CREATOR_NAME',
    value: '',
  },
  {
    id: 10,
    key: 'CREATE_DATE',
    value: '',
  },
  {
    id: 11,
    key: 'MEDIA_TYPE',
    value: '',
  },
  {
    id: 12,
    key: 'DOCUMENT_TYPE',
    value: '',
  },
  {
    id: 13,
    key: 'ITEM_CATEGORY',
    value: '',
  },
  {
    id: 14,
    key: 'ITEM_SUB_CATEGORY',
    value: '',
  },
  {
    id: 15,
    key: 'PAGE_COUNT',
    value: '',
  },
  {
    id: 16,
    key: 'REMARK',
    value: '',
  },
  {
    id: 17,
    key: 'BA_LONG_NAME',
    value: '',
  },
  {
    id: 18,
    key: 'BA_TYPE',
    value: '',
  },
  {
    id: 19,
    key: 'DATA_STORE_NAME',
    value: '',
  },
  {
    id: 20,
    key: 'DATA_STORE_TYPE',
    value: '',
  },
  {
    id: 21,
    key: 'SOURCE',
    value: '',
  },
  {
    id: 22,
    key: 'QC_STATUS',
    value: '',
  },
  {
    id: 23,
    key: 'CHECKED_BY_BA_ID',
    value: '',
  },
];