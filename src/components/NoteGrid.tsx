import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';

interface NoteGridProps {
  notes: Note[];
  allNotes: Note[];
  onNoteClick: (note: Note) => void;
  onLinkClick: (noteId: string) => void;
  onCreateNote: (title: string) => void;
}

export function NoteGrid({ notes, allNotes, onNoteClick, onLinkClick, onCreateNote }: NoteGridProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-neural-blue-500 to-neural-purple-600 rounded-full animate-pulse-glow opacity-20" />
          <div className="relative p-8 bg-gradient-to-br from-neural-blue-100 to-neural-purple-100 rounded-full">
            <Brain size={40} className="text-neural-blue-600" />
          </div>
        </div>
        <h3 className="heading-serif text-3xl text-neural-gray-800 mb-4">Your Neural Network Awaits</h3>
        <p className="body-text text-neural-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
          Begin your journey of knowledge visualization. Create your first thought and watch as connections emerge naturally.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-neural-blue-600">
          <Sparkles size={16} />
          <span>Every great mind starts with a single idea</span>
        </div>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className="masonry-item animate-fadeIn"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <NoteCard
            note={note}
            notes={allNotes}
            onClick={() => onNoteClick(note)}
            onLinkClick={onLinkClick}
            onCreateNote={onCreateNote}
          />
        </div>
      ))}
    </div>
  );
}