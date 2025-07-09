import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchColumn: string;
  onColumnChange: (column: string) => void;
  columns: string[];
  resultsCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  searchColumn,
  onColumnChange,
  columns,
  resultsCount
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your data..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>
        <div className="sm:w-48 lg:w-64">
          <select
            value={searchColumn}
            onChange={(e) => onColumnChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          >
            <option value="all">All Columns</option>
            {columns.map(column => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
      </div>
      {searchTerm && (
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 px-1">
          Found {resultsCount} result{resultsCount !== 1 ? 's' : ''} 
          {searchColumn !== 'all' && ` in "${searchColumn}"`}
        </div>
      )}
    </div>
  );
};

export default SearchBar;