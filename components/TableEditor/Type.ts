export interface WorkspaceType {
  id: number;
  afe_number: number;
  [key: string]: string | number;
}

export interface RowObject {
  id: number;
  [key: string]: string | number | null;
}
