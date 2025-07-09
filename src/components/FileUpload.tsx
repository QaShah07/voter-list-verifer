import React, { useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  fileName?: string;
  onClearFile?: () => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  fileName,
  onClearFile,
  isLoading
}) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  if (fileName) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <File className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-medium text-gray-700">{fileName}</span>
          </div>
          <button
            onClick={onClearFile}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer group"
    >
      <div className="text-center">
        <Upload className="h-16 w-16 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Upload CSV File
        </h3>
        <p className="text-gray-500 mb-6">
          Drag and drop your CSV file here, or click to browse
        </p>
        <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
          Choose File
        </label>
      </div>
    </div>
  );
};

export default FileUpload;