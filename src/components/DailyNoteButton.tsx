import React, { useState } from 'react';
import { Calendar, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { Note } from '../types';

interface DailyNoteButtonProps {
  todayNote: Note | undefined;
  recentDailyNotes: Note[];
  onTodayNoteClick: () => void;
  onDailyNoteClick: (note: Note) => void;
  formatDateForDisplay: (dateStr: string) => string;
}

export function DailyNoteButton({ 
  todayNote, 
  recentDailyNotes, 
  onTodayNoteClick, 
  onDailyNoteClick,
  formatDateForDisplay 
}: DailyNoteButtonProps) {
  const [showRecent, setShowRecent] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Recent daily notes dropdown */}
      {showRecent && recentDailyNotes.length > 0 && (
        <div className="absolute bottom-20 right-0 mb-4 w-80 bg-warm-white rounded-2xl floating-shadow border border-warm-gray-200/50 overflow-hidden animate-slideUp">
          <div className="p-6 bg-sage-50 border-b border-sage-200/50">
            <h3 className="heading-serif text-lg text-warm-gray-800 flex items-center gap-3">
              <Clock size={20} className="text-sage-600" />
              Recent Daily Notes
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentDailyNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  onDailyNoteClick(note);
                  setShowRecent(false);
                }}
                className="w-full p-5 text-left hover:bg-sage-50/50 transition-all duration-200 border-b border-warm-gray-100/50 last:border-b-0 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-warm-gray-800 mb-1">
                      {formatDateForDisplay(note.title)}
                    </div>
                    <div className="text-sm text-warm-gray-600 mb-2">
                      {note.title}
                    </div>
                    <div className="text-xs text-warm-gray-500">
                      {note.content.split('\n').filter(line => line.trim()).length} lines
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-warm-gray-400 group-hover:text-sage-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main floating button */}
      <div className="flex flex-col items-end gap-4">
        {/* Recent notes toggle */}
        {recentDailyNotes.length > 1 && (
          <button
            onClick={() => setShowRecent(!showRecent)}
            className={`
              p-4 rounded-full floating-shadow hover:floating-shadow-hover transition-all duration-300 hover-lift
              ${showRecent 
                ? 'bg-warm-gray-700 text-white' 
                : 'bg-warm-white text-warm-gray-600 hover:bg-warm-gray-50'
              }
            `}
          >
            <Clock size={22} />
          </button>
        )}

        {/* Today's note button */}
        <button
          onClick={onTodayNoteClick}
          className="group flex items-center gap-4 px-8 py-5 bg-sage-600 hover:bg-sage-700 text-white rounded-full floating-shadow hover:floating-shadow-hover transition-all duration-300 hover-lift daily-note-pulse"
        >
          <Calendar size={22} />
          <span className="font-medium text-lg">
            {todayNote ? "Today's Note" : "Start Daily Note"}
          </span>
          <div className="w-2.5 h-2.5 bg-sage-300 rounded-full animate-pulse" />
        </button>
      </div>

      {/* Gentle callout for first-time users */}
      {!todayNote && (
        <div className="absolute bottom-24 right-0 w-72 p-5 bg-amber-50 border border-amber-200/60 rounded-2xl floating-shadow animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl flex-shrink-0">
              <BookOpen size={18} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Start Your Daily Journal</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                Click to create today's note and begin your daily journaling practice.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-2 right-10 w-4 h-4 bg-amber-50 border-r border-b border-amber-200/60 transform rotate-45" />
        </div>
      )}
    </div>
  );
}