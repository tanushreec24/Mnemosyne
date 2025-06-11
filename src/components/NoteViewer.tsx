import React from 'react';
import { Note } from '../types';
import { findBacklinks } from '../utils/backlinks';
import { Edit, Trash2, X, Calendar, Tag, ArrowLeft } from 'lucide-react';

interface NoteViewerProps {
  note: Note;
  notes: Note[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onLinkClick: (noteId: string) => void;
  onCreateNote: (title: string) => void;
}

export function NoteViewer({ note, notes, onEdit, onDelete, onClose, onLinkClick, onCreateNote }: NoteViewerProps) {
  const backlinks = findBacklinks(note, notes);

  const handleBacklinkClick = (backlinkNote: Note) => {
    onLinkClick(backlinkNote.id);
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

  // Parse [[note links]] in the content
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex-1 mr-4">
            <h1 className="text-2xl font-serif font-medium text-slate-800 mb-2">
              {note.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                Created {note.createdAt.toLocaleDateString()}
              </div>
              {note.updatedAt > note.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Updated {note.updatedAt.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {note.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-full"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-8">
              <div 
                className="text-slate-700 leading-relaxed whitespace-pre-wrap"
                onClick={handleContentClick}
                dangerouslySetInnerHTML={{ __html: parseLinks(note.content) }}
              />
            </div>

            {backlinks.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-serif text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <ArrowLeft size={18} className="text-slate-500" />
                  Linked From ({backlinks.length})
                </h3>
                <div className="space-y-3">
                  {backlinks.map(backlinkNote => (
                    <div
                      key={backlinkNote.id}
                      onClick={() => handleBacklinkClick(backlinkNote)}
                      className="group p-4 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 group-hover:text-teal-600 transition-colors mb-1">
                            {backlinkNote.title}
                          </h4>
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {backlinkNote.content.slice(0, 150)}
                            {backlinkNote.content.length > 150 ? '...' : ''}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400 ml-4 flex-shrink-0">
                          {backlinkNote.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                      {backlinkNote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {backlinkNote.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-slate-500 text-xs rounded-full"
                            >
                              <Tag size={8} />
                              {tag}
                            </span>
                          ))}
                          {backlinkNote.tags.length > 3 && (
                            <span className="text-xs text-slate-400">
                              +{backlinkNote.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}