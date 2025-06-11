import { Note, NoteLink } from '../types';

export function parseLinks(content: string, notes: Note[]): { content: string; links: NoteLink[] } {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: NoteLink[] = [];
  const noteMap = new Map(notes.map(note => [note.title.toLowerCase(), note]));
  
  const parsedContent = content.replace(linkRegex, (match, linkText) => {
    const trimmedText = linkText.trim();
    const linkedNote = noteMap.get(trimmedText.toLowerCase());
    
    const link: NoteLink = {
      id: linkedNote?.id || '',
      title: trimmedText,
      exists: !!linkedNote
    };
    
    links.push(link);
    
    return linkedNote 
      ? `<span class="note-link note-link-exists" data-note-id="${linkedNote.id}">${trimmedText}</span>`
      : `<span class="note-link note-link-missing" data-note-title="${trimmedText}">${trimmedText}</span>`;
  });
  
  return { content: parsedContent, links };
}

export function extractPlainLinks(content: string): string[] {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const matches = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}