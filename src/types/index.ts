export interface CSVRow {
  [key: string]: string | number;
}

export interface CSVData {
  headers: string[];
  rows: CSVRow[];
}

export interface SearchResult {
  row: CSVRow;
  index: number;
  matchedColumns: string[];
}