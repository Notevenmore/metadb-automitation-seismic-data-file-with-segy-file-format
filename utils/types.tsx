export interface MatchingTable {
    [key: string]: {
        id: number; 
        key: string; 
        value: string | number;
    }
}

export interface HeaderResponse {
    status: number;
    response: String[];
}

export interface DeleteToggle {
  show: boolean;
  afe_number: number;
}