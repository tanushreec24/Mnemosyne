import React from 'react';
import { Note } from '../types';
import { Calendar, Tag, Brain, Zap } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  notes: Note[];
  onClick: () => void;
  onLinkClick: (noteId: string) => void;
  onCreateNote: (title: string) => void;
}

export function NoteCard({ note, notes, onClick, onLinkClick, onCreateNote }: NoteCardProps) {
  const preview = note.content.slice(0, 280) + (note.content.length > 280 ? '...' : '');

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Handle note links
    const target = e.target as HTMLElement;
    if (target.classList.contains('note-link-exists')) {
      const noteId = target.getAttribute('data-note-id');
      if (noteId) {
        onLinkClick(noteId);
      }
    } else if (target.classList.contains('note-link-missing')) {
      const noteTitle = target.getAttribute('data-note-title');
      if (noteTitle) {
        onCreateNote(noteTitle);
      }
    }
  };

  // Parse [[note links]] in the preview
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

  // Calculate connection strength
  const connectionCount = note.content.match(/\[\[([^\]]+)\]\]/g)?.length || 0;
  const getConnectionColor = () => {
    if (connectionCount === 0) return 'text-neural-gray-400';
    if (connectionCount <= 2) return 'text-neural-blue-500';
    if (connectionCount <= 5) return 'text-neural-purple-500';
    return 'text-neural-pink-500';
  };

  return (
    <div 
      className="group bg-neural-white/90 backdrop-blur-sm rounded-3xl card-shadow hover:card-shadow-hover transition-all duration-500 cursor-pointer border border-neural-gray-200/50 hover:border-neural-blue-200/60 hover-lift overflow-hidden"
      onClick={onClick}
    >
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-neural-blue-500 via-neural-purple-500 to-neural-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-8">
        {/* Header with connection indicator */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="heading-serif text-xl text-neural-gray-800 group-hover:text-neural-blue-700 transition-colors line-clamp-2 flex-1 mr-4">
            {note.title}
          </h3>
          {connectionCount > 0 && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-neural-gray-50 ${getConnectionColor()} text-xs font-medium`}>
              <Zap size={12} />
              {connectionCount}
            </div>
          )}
        </div>
        
        {preview && (
          <div 
            className="body-text text-neural-gray-700 mb-6 max-w-none overflow-hidden whitespace-pre-wrap line-clamp-4 leading-relaxed"
            onClick={handleContentClick}
            dangerouslySetInnerHTML={{ __html: parseLinks(preview) }}
          />
        )}

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="tag-neural"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="tag-neural">
                <Tag size={12} />
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-neural-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {note.updatedAt.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: note.updatedAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
            })}
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Brain size={14} className="text-neural-blue-500" />
            <span className="text-xs font-medium">Explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}