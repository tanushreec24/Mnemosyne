import { useState, useEffect } from 'react';
import { Note } from '../types';

const STORAGE_KEY = 'digital-garden-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        const notesWithDates = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, loading]);

  const addNote = (title: string, content: string = '', tags: string[] = []) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getNoteById = (id: string) => notes.find(note => note.id === id);
  
  const getNoteByTitle = (title: string) => 
    notes.find(note => note.title.toLowerCase() === title.toLowerCase());

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNoteByTitle
  };
}