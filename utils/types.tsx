export interface MatchingTable {
  [key: string]: {
    id: number;
    key: string;
    value: string | number;
  };
}

export interface HeaderResponse {
  status: number;
  response: String[];
}

export interface DeleteToggle {
  show: boolean;
  afe_number: number;
}

export interface DatatypeConfig {
  [key: string]: {
    workspace: string;
    afe: string;
    view: string;
    workspace_holder_key: string;
    column_binder: string;
  };
}

export interface ServicesConfig {
  services: {
    sheets: string;
  };
}
