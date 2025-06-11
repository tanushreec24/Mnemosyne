import { Note } from '../types';
import { extractPlainLinks } from './linkParser';

export function findBacklinks(targetNote: Note, allNotes: Note[]): Note[] {
  const backlinks: Note[] = [];
  
  for (const note of allNotes) {
    if (note.id === targetNote.id) continue;
    
    const links = extractPlainLinks(note.content);
    const hasBacklink = links.some(linkTitle => 
      linkTitle.toLowerCase() === targetNote.title.toLowerCase()
    );
    
    if (hasBacklink) {
      backlinks.push(note);
    }
  }
  
  return backlinks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}