import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Save, X, Tag as TagIcon, Eye, Edit3, SplitSquareHorizontal } from 'lucide-react';

interface NoteEditorProps {
  note?: Note;
  notes: Note[];
  onSave: (title: string, content: string, tags: string[]) => void;
  onCancel: () => void;
  onLinkClick: (noteId: string) => void;
  onCreateNote: (title: string) => void;
}

type ViewMode = 'edit' | 'preview' | 'split';

export function NoteEditor({ note, notes, onSave, onCancel, onLinkClick, onCreateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), content, tags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target.classList.contains('note-link-exists')) {
      e.preventDefault();
      const noteId = target.getAttribute('data-note-id');
      if (noteId) {
        onLinkClick(noteId);
      }
    } else if (target.classList.contains('note-link-missing')) {
      e.preventDefault();
      const noteTitle = target.getAttribute('data-note-title');
      if (noteTitle) {
        onCreateNote(noteTitle);
      }
    }
  };

  // Parse [[note links]] in the content for preview
  const parseLinks = (content: string) => {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    const noteMap = new Map(notes.map(note => [note.title.toLowerCase(), note]));
    
    return content.replace(linkRegex, (match, linkText) => {
      const trimmedText = linkText.trim();
      const linkedNote = noteMap.get(trimmedText.toLowerCase());
      
      return linkedNote 
        ? `<span class="note-link note-link-exists" data-note-id="${linkedNote.id}">${trimmedText}</span>`
        : `<span class="note-link note-link-missing" data-note-title="${trimmedText}">${trimmedText}</span>`;
    });
  };

  const ViewModeButton = ({ mode, icon: Icon, label }: { mode: ViewMode; icon: any; label: string }) => (
    <button
      onClick={() => setViewMode(mode)}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm
        ${viewMode === mode 
          ? 'bg-teal-600 text-white shadow-lg transform scale-105' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800'
        }
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl my-8 flex flex-col max-h-[calc(100vh-4rem)] animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-white/90 backdrop-blur-sm rounded-t-3xl flex-shrink-0">
          <div className="flex-1">
            <h2 className="heading-serif text-3xl text-gray-800 mb-2">
              {note ? 'Edit Note' : 'New Note'}
            </h2>
            <p className="body-text text-gray-600">
              {note ? 'Refine your thoughts' : 'Plant a new idea in your garden'}
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-3 mx-8">
            <ViewModeButton mode="edit" icon={Edit3} label="Edit" />
            <ViewModeButton mode="preview" icon={Eye} label="Preview" />
            <ViewModeButton mode="split" icon={SplitSquareHorizontal} label="Split" />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex items-center gap-3 px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover-lift font-medium"
            >
              <Save size={18} />
              Save Note
            </button>
            <button
              onClick={onCancel}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-200"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Give your thought a name..."
                className="w-full text-2xl heading-serif font-medium text-gray-800 bg-gray-50/50 border-2 border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-100/50 transition-all duration-300 placeholder-gray-400"
                autoFocus
              />
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 text-sm rounded-full border border-teal-200 animate-fadeIn"
                  >
                    <TagIcon size={12} />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-teal-500 hover:text-teal-700 ml-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area with View Modes */}
            <div className="space-y-3 flex-1">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              
              {/* Helper Text */}
              <div className="text-sm text-gray-600 bg-teal-50/50 px-4 py-3 rounded-xl border border-teal-200/40">
                <strong>💡 Tip:</strong> Use [[Note Title]] to link to other notes. 
                Links will be created automatically when you reference them.
              </div>

              {/* Split View Container */}
              <div className={`
                grid gap-6 transition-all duration-500 ease-in-out
                ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}
              `}>
                {/* Editor Panel */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                  <div className={`
                    transition-all duration-500 ease-in-out
                    ${viewMode === 'split' ? 'opacity-100' : viewMode === 'edit' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  `}>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Start planting a thought…

Let your ideas bloom here. Connect them with [[other notes]] to grow your digital garden.

What's on your mind today?"
                      className="w-full text-gray-700 bg-gray-50/30 border-2 border-gray-200 rounded-2xl p-6 outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-100/50 resize-none leading-relaxed transition-all duration-300 placeholder-gray-400 body-text"
                      style={{ 
                        minHeight: viewMode === 'split' ? '400px' : '500px',
                        height: viewMode === 'split' ? '400px' : '500px'
                      }}
                    />
                  </div>
                )}

                {/* Preview Panel */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                  <div className={`
                    transition-all duration-500 ease-in-out
                    ${viewMode === 'split' ? 'opacity-100' : viewMode === 'preview' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  `}>
                    <div 
                      className="bg-white border-2 border-gray-200 rounded-2xl p-6 overflow-y-auto" 
                      style={{ 
                        minHeight: viewMode === 'split' ? '400px' : '500px',
                        height: viewMode === 'split' ? '400px' : '500px'
                      }}
                    >
                      {content ? (
                        <div 
                          className="body-text text-gray-700 leading-relaxed whitespace-pre-wrap"
                          onClick={handleContentClick}
                          dangerouslySetInnerHTML={{ __html: parseLinks(content) }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <Eye size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Preview will appear here</p>
                            <p className="text-sm mt-2">Start writing to see your note come to life</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
