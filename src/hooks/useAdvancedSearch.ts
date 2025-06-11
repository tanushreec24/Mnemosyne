import { useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Note } from '../types';

interface UseAdvancedSearchOptions {
  threshold?: number;
  includeScore?: boolean;
  keys?: string[];
  maxHistory?: number;
}

interface SearchState {
  query: string;
  selectedTags: string[];
  searchHistory: string[];
}

export function useAdvancedSearch(
  notes: Note[], 
  options: UseAdvancedSearchOptions = {}
) {
  const {
    threshold = 0.3,
    includeScore = false,
    keys = ['title', 'content', 'tags'],
    maxHistory = 10
  } = options;

  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    selectedTags: [],
    searchHistory: []
  });

  // Create Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys,
      threshold,
      includeScore,
      includeMatches: true,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 1,
      shouldSort: true,
      getFn: (obj, path) => {
        if (path === 'title') return obj.title;
        if (path === 'content') return obj.content;
        if (path === 'tags') return obj.tags.join(' ');
        return '';
      }
    });
  }, [notes, threshold, includeScore, keys]);

  // Get all unique tags from notes
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter notes based on search criteria
  const filteredNotes = useMemo(() => {
    let results = notes;

    // Apply text search if query exists
    if (searchState.query.trim()) {
      const searchResults = fuse.search(searchState.query);
      results = searchResults.map(result => result.item);
    }

    // Apply tag filters
    if (searchState.selectedTags.length > 0) {
      results = results.filter(note => 
        searchState.selectedTags.every(tag => 
          note.tags.some(noteTag => 
            noteTag.toLowerCase() === tag.toLowerCase()
          )
        )
      );
    }

    return results;
  }, [fuse, searchState.query, searchState.selectedTags, notes]);

  // Update search query
  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query
    }));
  }, []);

  // Add tag to selection
  const selectTag = useCallback((tag: string) => {
    setSearchState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag) 
        ? prev.selectedTags 
        : [...prev.selectedTags, tag]
    }));
  }, []);

  // Remove tag from selection
  const removeTag = useCallback((tag: string) => {
    setSearchState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(t => t !== tag)
    }));
  }, []);

  // Clear all filters
  const clearAll = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      selectedTags: []
    }));
  }, []);

  // Add to search history
  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setSearchState(prev => {
      const newHistory = [query, ...prev.searchHistory.filter(h => h !== query)]
        .slice(0, maxHistory);
      return {
        ...prev,
        searchHistory: newHistory
      };
    });
  }, [maxHistory]);

  // Select from history
  const selectFromHistory = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query
    }));
    addToHistory(query);
  }, [addToHistory]);

  // Get search suggestions based on current input
  const getSearchSuggestions = useCallback((input: string) => {
    if (!input.trim()) return [];
    
    const suggestions = new Set<string>();
    
    // Add matching note titles
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(input.toLowerCase())) {
        suggestions.add(note.title);
      }
    });
    
    // Add matching tags
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(input.toLowerCase())) {
        suggestions.add(`#${tag}`);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [notes, allTags]);

  // Get popular tags (most used)
  const getPopularTags = useCallback((limit: number = 10) => {
    const tagCounts = new Map<string, number>();
    
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  }, [notes]);

  return {
    // State
    query: searchState.query,
    selectedTags: searchState.selectedTags,
    searchHistory: searchState.searchHistory,
    
    // Results
    filteredNotes,
    resultCount: filteredNotes.length,
    allTags,
    
    // Actions
    setQuery,
    selectTag,
    removeTag,
    clearAll,
    addToHistory,
    selectFromHistory,
    
    // Utilities
    getSearchSuggestions,
    getPopularTags,
    
    // Computed
    hasActiveFilters: searchState.query.trim().length > 0 || searchState.selectedTags.length > 0,
    isEmpty: notes.length === 0,
    hasResults: filteredNotes.length > 0
  };
}