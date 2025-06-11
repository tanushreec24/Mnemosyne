import React, { useState } from 'react';
import { Filter, Calendar, SortAsc, SortDesc, Grid, List, X } from 'lucide-react';

interface SearchFiltersProps {
  sortBy: 'relevance' | 'date' | 'title' | 'updated';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  dateRange?: { start: Date; end: Date };
  onDateRangeChange: (range: { start: Date; end: Date } | undefined) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function SearchFilters({
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  dateRange,
  onDateRangeChange,
  showFilters,
  onToggleFilters
}: SearchFiltersProps) {
  const [startDate, setStartDate] = useState(
    dateRange?.start.toISOString().split('T')[0] || ''
  );
  const [endDate, setEndDate] = useState(
    dateRange?.end.toISOString().split('T')[0] || ''
  );

  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      onDateRangeChange({
        start: new Date(startDate),
        end: new Date(endDate)
      });
    }
  };

  const handleDateRangeClear = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange(undefined);
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Created Date' },
    { value: 'updated', label: 'Updated Date' },
    { value: 'title', label: 'Title' }
  ];

  return (
    <div className="space-y-4">
      {/* Filter Toggle & View Mode */}
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleFilters}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm
            ${showFilters 
              ? 'bg-sage-600 text-white shadow-lg' 
              : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
            }
          `}
        >
          <Filter size={16} />
          Filters
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'grid' 
                ? 'bg-sage-600 text-white' 
                : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
              }
            `}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'list' 
                ? 'bg-sage-600 text-white' 
                : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
              }
            `}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-warm-gray-50 rounded-2xl p-6 space-y-6 animate-slideUp">
          {/* Sort Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-warm-gray-700">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value, sortOrder)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-all duration-200
                    ${sortBy === option.value
                      ? 'bg-sage-600 text-white'
                      : 'bg-warm-white text-warm-gray-700 hover:bg-sage-50 border border-warm-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Sort Order */}
            <div className="flex gap-2">
              <button
                onClick={() => onSortChange(sortBy, 'asc')}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200
                  ${sortOrder === 'asc'
                    ? 'bg-sage-600 text-white'
                    : 'bg-warm-white text-warm-gray-700 hover:bg-sage-50 border border-warm-gray-200'
                  }
                `}
              >
                <SortAsc size={14} />
                Ascending
              </button>
              <button
                onClick={() => onSortChange(sortBy, 'desc')}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200
                  ${sortOrder === 'desc'
                    ? 'bg-sage-600 text-white'
                    : 'bg-warm-white text-warm-gray-700 hover:bg-sage-50 border border-warm-gray-200'
                  }
                `}
              >
                <SortDesc size={14} />
                Descending
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-warm-gray-700">
              Date Range
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-warm-gray-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-warm-gray-200 rounded-lg focus:border-sage-300 focus:ring-2 focus:ring-sage-100 outline-none"
                />
              </div>
              <span className="text-warm-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 text-sm border border-warm-gray-200 rounded-lg focus:border-sage-300 focus:ring-2 focus:ring-sage-100 outline-none"
              />
              <button
                onClick={handleDateRangeApply}
                disabled={!startDate || !endDate}
                className="px-4 py-2 text-sm bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
              {dateRange && (
                <button
                  onClick={handleDateRangeClear}
                  className="p-2 text-warm-gray-500 hover:text-warm-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}