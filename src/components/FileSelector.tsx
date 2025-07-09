import React from 'react';
import { Database, FileText } from 'lucide-react';

interface FileSelectorProps {
  availableFiles: string[];
  selectedFile: string;
  onFileSelect: (fileName: string) => void;
  isLoading?: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  availableFiles,
  selectedFile,
  onFileSelect,
  isLoading
}) => {
  if (availableFiles.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-200 shadow-lg text-center">
        <Database className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No CSV Files Found</h3>
        <p className="text-sm sm:text-base text-gray-500 px-2">
          Please add CSV files to the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs sm:text-sm">public/csv-data/</code> folder
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <Database className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Select CSV File</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {availableFiles.map((fileName) => (
          <button
            key={fileName}
            onClick={() => onFileSelect(fileName)}
            disabled={isLoading}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left active:scale-95 ${
              selectedFile === fileName
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 active:bg-blue-100/50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer touch-manipulation'}`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <FileText className={`h-5 w-5 ${
                selectedFile === fileName ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <div>
                <p className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{fileName}</p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">CSV Data File</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {isLoading && (
        <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading file...</span>
        </div>
      )}
    </div>
  );
};

export default FileSelector;