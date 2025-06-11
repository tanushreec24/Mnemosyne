import { useEffect, useMemo, useRef } from 'react';
import { Note } from '../types';

interface UseDailyNotesProps {
  notes: Note[];
  addNote: (title: string, content?: string, tags?: string[]) => Note;
  getNoteByTitle: (title: string) => Note | undefined;
}

export function useDailyNotes({ notes, addNote, getNoteByTitle }: UseDailyNotesProps) {
  const hasCreatedTodayNote = useRef(false);
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const todayDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // Find today's daily note
  const todayNote = useMemo(() => {
    return getNoteByTitle(todayDate);
  }, [todayDate, getNoteByTitle, notes]); // Add notes dependency to trigger re-evaluation

  // Auto-create today's note if it doesn't exist (only once)
  useEffect(() => {
    // Only create if:
    // 1. No today note exists
    // 2. We haven't already created one in this session
    // 3. There are notes loaded (to avoid creating during initial load)
    if (!todayNote && !hasCreatedTodayNote.current && notes.length >= 0) {
      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = today.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
      
      const initialContent = `${dayName}, ${monthDay}

Today's Focus:


Notes:


Reflections:


This is your daily note for ${todayDate}. Use it to capture thoughts, tasks, and reflections for the day.`;

      addNote(todayDate, initialContent, ['daily', 'journal']);
      hasCreatedTodayNote.current = true;
    }
  }, [todayNote, todayDate, addNote, notes.length]);

  // Reset the creation flag when the date changes (for new day)
  useEffect(() => {
    hasCreatedTodayNote.current = false;
  }, [todayDate]);

  // Get all daily notes (sorted by date, newest first)
  const dailyNotes = useMemo(() => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return notes
      .filter(note => dateRegex.test(note.title))
      .sort((a, b) => b.title.localeCompare(a.title)); // Newest first
  }, [notes]);

  // Get recent daily notes (last 7 days, excluding today)
  const recentDailyNotes = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    return dailyNotes
      .filter(note => note.title >= sevenDaysAgoStr && note.title !== todayDate)
      .slice(0, 6); // Limit to 6 recent notes
  }, [dailyNotes, todayDate]);

  // Format date for display
  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  return {
    todayNote,
    todayDate,
    dailyNotes,
    recentDailyNotes,
    formatDateForDisplay
  };
}