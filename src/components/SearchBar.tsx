import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, Filter, Clock, Sparkles, Brain } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onClearAll: () => void;
  searchHistory: string[];
  onHistorySelect: (query: string) => void;
  resultCount: number;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search thoughts...", 
  className = "",
  allTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearAll,
  searchHistory,
  onHistorySelect,
  resultCount
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 150);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Update tag suggestions based on input
  useEffect(() => {
    if (localValue.includes('#')) {
      const tagQuery = localValue.split('#').pop()?.toLowerCase() || '';
      const suggestions = allTags
        .filter(tag => 
          tag.toLowerCase().includes(tagQuery) && 
          !selectedTags.includes(tag)
        )
        .slice(0, 5);
      setTagSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
  }, [localValue, allTags, selectedTags]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!localValue && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding to allow for clicks on suggestions
    setTimeout(() => {
      setShowHistory(false);
    }, 200);
  };

  const handleTagSuggestionClick = (tag: string) => {
    const parts = localValue.split('#');
    parts.pop(); // Remove the partial tag
    const newValue = parts.join('#') + (parts.length > 1 ? '#' : '');
    setLocalValue(newValue);
    onChange(newValue);
    onTagSelect(tag);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleHistorySelect = (query: string) => {
    setLocalValue(query);
    onChange(query);
    onHistorySelect(query);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const hasActiveFilters = selectedTags.length > 0 || value.trim().length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className={`
        relative flex items-center transition-all duration-500 ease-out
        ${isFocused 
          ? 'transform scale-[1.02] search-focused' 
          : 'hover:scale-[1.01]'
        }
      `}>
        {/* Teal glow effect */}
        <div className="search-teal-glow absolute inset-0 rounded-full -z-10" />
        
        <Search 
          size={22} 
          className={`
            absolute left-6 transition-all duration-300 z-10
            ${isFocused ? 'text-teal-600 scale-110' : 'text-gray-500'}
          `} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={`${placeholder} • Use # for tags...`}
          className={`
            w-full pl-16 pr-16 py-6 
            bg-white/90 backdrop-blur-xl
            border-2 rounded-full
            outline-none 
            transition-all duration-500 ease-out
            placeholder-gray-500
            body-text text-gray-800 text-lg
            shadow-lg
            ${isFocused 
              ? 'border-teal-300 bg-white ring-4 ring-teal-100/50 shadow-xl shadow-teal-200/20' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-xl'
            }
          `}
        />
        
        {(localValue || hasActiveFilters) && (
          <button
            onClick={onClearAll}
            className={`
              absolute right-6 p-2 rounded-full z-10
              transition-all duration-300
              ${isFocused 
                ? 'text-teal-600 hover:text-teal-700 hover:bg-teal-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Active Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-6 animate-slideUp">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 text-sm rounded-full border border-teal-300 animate-fadeIn shadow-sm"
            >
              <Tag size={12} />
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="text-teal-500 hover:text-teal-700 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Results Summary */}
      {(value.trim() || selectedTags.length > 0) && (
        <div className="text-center mt-6 animate-slideUp">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50/80 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-gray-200/50">
            <Brain size={16} className="text-teal-500" />
            {resultCount === 0 
              ? 'No thoughts found' 
              : `${resultCount} thought${resultCount === 1 ? '' : 's'} discovered`
            }
            {selectedTags.length > 0 && (
              <span className="text-teal-600 flex items-center gap-1">
                <Sparkles size={12} />
                {selectedTags.length} tag{selectedTags.length === 1 ? '' : 's'} active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {(showSuggestions || showHistory) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-slideUp"
        >
          {/* Tag Suggestions */}
          {showSuggestions && tagSuggestions.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-sm font-medium text-gray-700">
                <Tag size={16} className="text-teal-500" />
                Tags
              </div>
              <div className="space-y-2">
                {tagSuggestions.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagSuggestionClick(tag)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                  >
                    <Tag size={14} className="text-teal-600 group-hover:scale-110 transition-transform" />
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {showHistory && searchHistory.length > 0 && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 text-sm font-medium text-gray-700">
                <Clock size={16} className="text-teal-500" />
                Recent Searches
              </div>
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistorySelect(query)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                  >
                    <Search size={14} className="text-gray-400 group-hover:text-teal-500 transition-colors" />
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Filter Buttons */}
      {allTags.length > 0 && !isFocused && (
        <div className="mt-6 animate-slideUp">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Popular Tags</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => onTagSelect(tag)}
                disabled={selectedTags.includes(tag)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 font-medium
                  ${selectedTags.includes(tag)
                    ? 'bg-teal-100 text-teal-700 border border-teal-200 cursor-not-allowed opacity-50'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 hover:scale-105'
                  }
                `}
              >
                <Tag size={12} />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
