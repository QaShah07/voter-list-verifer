import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface DataTableProps {
  data: any[];
  headers: string[];
  searchTerm?: string;
  matchedColumns?: { [key: number]: string[] };
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  headers,
  searchTerm,
  matchedColumns = {}
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const exportToCSV = () => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 sm:p-12 border border-gray-200 shadow-lg text-center">
        <p className="text-gray-500 text-base sm:text-lg">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Data Results ({data.length} records)
        </h3>
        <div className="flex items-center space-x-3">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        <div className="divide-y divide-gray-200">
          {currentData.map((row, index) => (
            <div key={startIndex + index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="space-y-2">
                {headers.map(header => {
                  const cellValue = String(row[header] || '');
                  const isMatched = matchedColumns[startIndex + index]?.includes(header);
                  
                  return (
                    <div key={header} className={`${isMatched ? 'bg-blue-50 -mx-2 px-2 py-1 rounded' : ''}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {header}
                        </span>
                        <span className="text-sm text-gray-900 mt-1">
                          {searchTerm && isMatched
                            ? highlightText(cellValue, searchTerm)
                            : cellValue || '-'
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th
                  key={header}
                  className="px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  <div className="truncate max-w-[120px] lg:max-w-none" title={header}>
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={startIndex + index} className="hover:bg-gray-50 transition-colors">
                {headers.map(header => {
                  const cellValue = String(row[header] || '');
                  const isMatched = matchedColumns[startIndex + index]?.includes(header);
                  
                  return (
                    <td
                      key={header}
                      className={`px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 ${
                        isMatched ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="truncate max-w-[120px] lg:max-w-[200px] xl:max-w-none" title={cellValue}>
                        {searchTerm && isMatched
                          ? highlightText(cellValue, searchTerm)
                          : cellValue || '-'
                        }
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs sm:text-sm font-medium text-gray-700 px-2 sm:px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;