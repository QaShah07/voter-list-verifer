export const getAvailableCSVFiles = async (): Promise<string[]> => {
  // In a real application, you might want to have an API endpoint that lists files
  // For now, we'll use a predefined list of files that should be in the csv-data folder
  const knownFiles = [
    'sample-data.csv',
    // Add more CSV files here as you add them to the public/csv-data folder
  ];
  
  // Filter files that actually exist
  const existingFiles: string[] = [];
  
  for (const fileName of knownFiles) {
    try {
      const response = await fetch(`/csv-data/${fileName}`);
      if (response.ok) {
        existingFiles.push(fileName);
      }
    } catch (error) {
      console.warn(`File ${fileName} not found`);
    }
  }
  
  return existingFiles;
};

export const loadCSVFile = async (fileName: string): Promise<string> => {
  try {
    const response = await fetch(`/csv-data/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Error loading CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};