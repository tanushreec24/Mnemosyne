import React, { useState, useMemo } from 'react';
import { Note } from './types';
import { useNotes } from './hooks/useNotes';
import { useAdvancedSearch } from './hooks/useAdvancedSearch';
import { useDailyNotes } from './hooks/useDailyNotes';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SearchFilters } from './components/SearchFilters';
import { TagCloud } from './components/TagCloud';
import { NoteGrid } from './components/NoteGrid';
import { NoteEditor } from './components/NoteEditor';
import { NoteViewer } from './components/NoteViewer';
import { GraphView } from './components/GraphView';
import { DailyNoteButton } from './components/DailyNoteButton';
import { Brain, Sparkles } from 'lucide-react';

function App() {
  const { notes, loading, addNote, updateNote, deleteNote, getNoteById, getNoteByTitle } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'updated'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | undefined>();

  // Advanced search functionality
  const {
    query,
    selectedTags,
    searchHistory,
    filteredNotes: searchResults,
    resultCount,
    allTags,
    setQuery,
    selectTag,
    removeTag,
    clearAll,
    addToHistory,
    selectFromHistory,
    getPopularTags,
    hasActiveFilters
  } = useAdvancedSearch(notes, {
    threshold: 0.3,
    keys: ['title', 'content', 'tags']
  });

  // Daily notes functionality
  const { todayNote, todayDate, recentDailyNotes, formatDateForDisplay } = useDailyNotes({
    notes,
    addNote,
    getNoteByTitle
  });

  // Sort and filter results
  const sortedAndFilteredNotes = useMemo(() => {
    let results = [...searchResults];

    // Apply date range filter
    if (dateRange) {
      results = results.filter(note => {
        const noteDate = new Date(note.createdAt);
        return noteDate >= dateRange.start && noteDate <= dateRange.end;
      });
    }

    // Apply sorting
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'relevance':
        default:
          // For relevance, maintain the order from search results
          return 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return results;
  }, [searchResults, dateRange, sortBy, sortOrder]);

  // Get popular tags with counts
  const popularTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const handleNewNote = () => {
    setIsCreatingNote(true);
    setEditingNote(null);
    setViewingNote(null);
    setShowGraph(false);
  };

  const handleShowGraph = () => {
    setShowGraph(true);
    setEditingNote(null);
    setViewingNote(null);
    setIsCreatingNote(false);
  };

  const handleTodayNoteClick = () => {
    if (todayNote) {
      setViewingNote(todayNote);
      setEditingNote(null);
      setShowGraph(false);
      setIsCreatingNote(false);
    }
  };

  const handleDailyNoteClick = (note: Note) => {
    setViewingNote(note);
    setEditingNote(null);
    setShowGraph(false);
    setIsCreatingNote(false);
  };

  const handleCreateNoteFromTitle = (title: string) => {
    const newNote = addNote(title);
    setEditingNote(newNote);
    setViewingNote(null);
    setIsCreatingNote(false);
    setShowGraph(false);
  };

  const handleSaveNote = (title: string, content: string, tags: string[]) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content, tags });
    } else {
      addNote(title, content, tags);
    }
    setEditingNote(null);
    setIsCreatingNote(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setViewingNote(null);
    setShowGraph(false);
  };

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
    setEditingNote(null);
    setShowGraph(false);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setViewingNote(null);
    setEditingNote(null);
  };

  const handleLinkClick = (noteId: string) => {
    const note = getNoteById(noteId);
    if (note) {
      setViewingNote(note);
      setEditingNote(null);
      setShowGraph(false);
    }
  };

  const handleGraphNodeClick = (noteId: string) => {
    const note = getNoteById(noteId);
    if (note) {
      setViewingNote(note);
      setShowGraph(false);
    }
  };

  const handleCancel = () => {
    setEditingNote(null);
    setIsCreatingNote(false);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy as any);
    setSortOrder(newSortOrder);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addToHistory(query);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neural-white via-neural-gray-50 to-neural-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-neural-blue-100 rounded-full mb-8 animate-pulse-glow">
            <Brain size={32} className="text-neural-blue-600" />
          </div>
          <h2 className="heading-serif text-3xl text-neural-gray-800 mb-3">Initializing Mnemosyne</h2>
          <p className="body-text text-neural-gray-600">Preparing your knowledge visualization platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-white via-neural-gray-50 to-neural-blue-50">
      <Header onNewNote={handleNewNote} onShowGraph={handleShowGraph} />
      
      <main className="max-w-7xl mx-auto container-padding py-16">
        {/* Enhanced Search Section */}
        <div className="mb-16 space-y-8">
          <SearchBar 
            value={query}
            onChange={setQuery}
            placeholder={`Explore ${notes.length} thoughts`}
            className="search-container"
            allTags={allTags}
            selectedTags={selectedTags}
            onTagSelect={selectTag}
            onTagRemove={removeTag}
            onClearAll={clearAll}
            searchHistory={searchHistory}
            onHistorySelect={selectFromHistory}
            resultCount={resultCount}
          />

          {/* Search Filters */}
          <SearchFilters
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* Tag Cloud */}
          {!hasActiveFilters && popularTags.length > 0 && (
            <div className="animate-slideUp">
              <TagCloud
                tags={popularTags}
                selectedTags={selectedTags}
                onTagSelect={selectTag}
                onTagRemove={removeTag}
                maxTags={15}
                showCounts={true}
              />
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {hasActiveFilters && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sparkles size={24} className="text-neural-blue-600" />
                <h2 className="heading-serif text-2xl text-neural-gray-800">
                  Knowledge Connections
                </h2>
              </div>
              <button
                onClick={clearAll}
                className="text-sm text-neural-gray-600 hover:text-neural-gray-800 transition-colors px-4 py-2 rounded-xl hover:bg-neural-gray-100"
              >
                Clear all filters
              </button>
            </div>
          )}

          <NoteGrid
            notes={sortedAndFilteredNotes}
            allNotes={notes}
            onNoteClick={handleViewNote}
            onLinkClick={handleLinkClick}
            onCreateNote={handleCreateNoteFromTitle}
          />
        </div>
      </main>

      {/* Daily Note Floating Button */}
      <DailyNoteButton
        todayNote={todayNote}
        recentDailyNotes={recentDailyNotes}
        onTodayNoteClick={handleTodayNoteClick}
        onDailyNoteClick={handleDailyNoteClick}
        formatDateForDisplay={formatDateForDisplay}
      />

      {showGraph && (
        <GraphView
          notes={notes}
          onClose={() => setShowGraph(false)}
          onNodeClick={handleGraphNodeClick}
        />
      )}

      {(editingNote || isCreatingNote) && (
        <NoteEditor
          note={editingNote}
          notes={notes}
          onSave={handleSaveNote}
          onCancel={handleCancel}
          onLinkClick={handleLinkClick}
          onCreateNote={handleCreateNoteFromTitle}
        />
      )}

      {viewingNote && (
        <NoteViewer
          note={viewingNote}
          notes={notes}
          onEdit={() => handleEditNote(viewingNote)}
          onDelete={() => handleDeleteNote(viewingNote.id)}
          onClose={() => setViewingNote(null)}
          onLinkClick={handleLinkClick}
          onCreateNote={handleCreateNoteFromTitle}
        />
      )}
    </div>
  );
}

export default App;