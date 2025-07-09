import { CSVData } from '../types';

export const parseCSV = (csvText: string): CSVData => {
  const lines = csvText.trim().split('\n');
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse headers
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse rows
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const row: { [key: string]: string | number } = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Try to parse as number if it's numeric
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });
    
    return row;
  });

  return { headers, rows };
};

export const searchCSV = (
  data: CSVData,
  searchTerm: string,
  searchColumn?: string
): { row: any; index: number; matchedColumns: string[] }[] => {
  if (!searchTerm) return [];
  
  const results: { row: any; index: number; matchedColumns: string[] }[] = [];
  
  data.rows.forEach((row, index) => {
    const matchedColumns: string[] = [];
    
    if (searchColumn && searchColumn !== 'all') {
      // Search in specific column
      const value = String(row[searchColumn]).toLowerCase();
      if (value.includes(searchTerm.toLowerCase())) {
        matchedColumns.push(searchColumn);
      }
    } else {
      // Search in all columns
      data.headers.forEach(header => {
        const value = String(row[header]).toLowerCase();
        if (value.includes(searchTerm.toLowerCase())) {
          matchedColumns.push(header);
        }
      });
    }
    
    if (matchedColumns.length > 0) {
      results.push({ row, index, matchedColumns });
    }
  });
  
  return results;
};