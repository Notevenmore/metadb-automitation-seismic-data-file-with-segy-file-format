export interface WorkspaceType {
  id: number;
  afe_number: number;
  print_well_report_id: number;
}

export interface RowObject {
  id: number;
  [key: string]: string | number | null;
}
