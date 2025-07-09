import React, { useState, useMemo, useEffect } from 'react';
import { Database, AlertCircle, Menu, X } from 'lucide-react';
import FileSelector from './components/FileSelector';
import SearchBar from './components/SearchBar';
import DataTable from './components/DataTable';
import { parseCSV, searchCSV } from './utils/csvParser';
import { getAvailableCSVFiles, loadCSVFile } from './utils/fileLoader';
import { CSVData, SearchResult } from './types';

function App() {
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Load available files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await getAvailableCSVFiles();
        setAvailableFiles(files);
        // Auto-select first file if available
        if (files.length > 0 && !selectedFile) {
          setSelectedFile(files[0]);
        }
      } catch (err) {
        setError('Failed to load available CSV files');
      }
    };
    
    loadFiles();
  }, [selectedFile]);

  // Load CSV data when file is selected
  useEffect(() => {
    if (selectedFile) {
      handleFileLoad(selectedFile);
    }
  }, [selectedFile]);

  const handleFileLoad = async (fileName: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const csvText = await loadCSVFile(fileName);
      const parsedData = parseCSV(csvText);
      setCsvData(parsedData);
      setSearchTerm('');
      setSearchColumn('all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CSV file');
      setCsvData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const searchResults = useMemo(() => {
    if (!csvData || !searchTerm) return [];
    return searchCSV(csvData, searchTerm, searchColumn);
  }, [csvData, searchTerm, searchColumn]);

  const displayData = useMemo(() => {
    if (!csvData) return [];
    return searchTerm ? searchResults.map(result => result.row) : csvData.rows;
  }, [csvData, searchTerm, searchResults]);

  const matchedColumns = useMemo(() => {
    if (!searchTerm) return {};
    const matched: { [key: number]: string[] } = {};
    searchResults.forEach((result, index) => {
      matched[index] = result.matchedColumns;
    });
    return matched;
  }, [searchTerm, searchResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Database className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Search and find Voterlist</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Search through your CSV data files with ease
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-start sm:items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm sm:text-base text-red-700">{error}</p>
          </div>
        )}

        {/* File Selector */}
        <div className="mb-6 sm:mb-8">
          <FileSelector
            availableFiles={availableFiles}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
          />
        </div>

        {/* Search Bar */}
        {csvData && (
          <div className="mb-6 sm:mb-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchColumn={searchColumn}
              onColumnChange={setSearchColumn}
              columns={csvData.headers}
              resultsCount={searchResults.length}
            />
          </div>
        )}

        {/* Data Table */}
        {csvData && (
          <DataTable
            data={displayData}
            headers={csvData.headers}
            searchTerm={searchTerm}
            matchedColumns={matchedColumns}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm sm:text-base text-gray-600">Loading CSV data...</p>
          </div>
        )}

        {/* Instructions */}
        {availableFiles.length === 0 && !isLoading && (
          <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">Getting Started</h3>
            <div className="text-sm sm:text-base text-blue-700 space-y-2">
              <p>1. Add your CSV files to the <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs sm:text-sm">public/csv-data/</code> folder</p>
              <p>2. Update the file list in <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs sm:text-sm">src/utils/fileLoader.ts</code></p>
              <p>3. Refresh the page to see your files</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;