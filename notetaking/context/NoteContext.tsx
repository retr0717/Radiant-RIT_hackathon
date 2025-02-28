import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { PathData } from '@/components/DrawingCanvas';

export interface Note {
  id: string;
  title: string;
  content: string;
  paths: PathData[];
  hasDrawing: boolean;
  drawingThumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Highlight {
  id: string;
  text: string;
  color: string;
  aiInfo?: string;
  sourceUrl?: string;
}

export interface NoteHighlight {
  noteId: string;
  highlights: Highlight[];
}

interface NoteContextType {
  notes: Note[];
  highlights: NoteHighlight[];
  getNote: (id: string) => Note | undefined;
  createNote: () => string;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  clearAllNotes: () => void;
  addHighlight: (highlight: Highlight, noteId?: string) => void;
  updateHighlight: (highlightId: string, data: Partial<Highlight>) => void;
  deleteHighlight: (highlightId: string) => void;
  exportData: () => Promise<string>;
  importData: () => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<NoteHighlight[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (notes.length > 0) {
      saveNotes();
    }
  }, [notes]);
  
  useEffect(() => {
    if (highlights.length > 0) {
      saveHighlights();
    }
  }, [highlights]);
  
  const loadData = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const storedHighlights = await AsyncStorage.getItem('highlights');
      
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
      
      if (storedHighlights) {
        setHighlights(JSON.parse(storedHighlights));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };
  
  const saveHighlights = async () => {
    try {
      await AsyncStorage.setItem('highlights', JSON.stringify(highlights));
    } catch (error) {
      console.error('Error saving highlights:', error);
    }
  };
  
  const getNote = (id: string) => {
    return notes.find(note => note.id === id);
  };
  
  const createNote = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    
    const newNote: Note = {
      id,
      title: '',
      content: '',
      paths: [],
      hasDrawing: false,
      createdAt: now,
      updatedAt: now,
    };
    
    setNotes(prev => [...prev, newNote]);
    setCurrentNoteId(id);
    
    return id;
  };
  
  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, ...data } : note
      )
    );
  };
  
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    setHighlights(prev => prev.filter(highlight => highlight.noteId !== id));
  };
  
  const clearAllNotes = () => {
    setNotes([]);
    setHighlights([]);
    AsyncStorage.removeItem('notes');
    AsyncStorage.removeItem('highlights');
  };
  
  const addHighlight = (highlight: Highlight, noteId?: string) => {
    const targetNoteId = noteId || currentNoteId;
    if (!targetNoteId) return;
    
    setHighlights(prev => {
      const existingNoteHighlightIndex = prev.findIndex(nh => nh.noteId === targetNoteId);
      
      if (existingNoteHighlightIndex >= 0) {
        const updatedHighlights = [...prev];
        updatedHighlights[existingNoteHighlightIndex] = {
          ...updatedHighlights[existingNoteHighlightIndex],
          highlights: [...updatedHighlights[existingNoteHighlightIndex].highlights, highlight],
        };
        return updatedHighlights;
      } else {
        return [...prev, {
          noteId: targetNoteId,
          highlights: [highlight],
        }];
      }
    });
  };
  
  const updateHighlight = (highlightId: string, data: Partial<Highlight>) => {
    setHighlights(prev => 
      prev.map(noteHighlight => ({
        ...noteHighlight,
        highlights: noteHighlight.highlights.map(highlight => 
          highlight.id === highlightId ? { ...highlight, ...data } : highlight
        ),
      }))
    );
  };
  
  const deleteHighlight = (highlightId: string) => {
    setHighlights(prev => 
      prev.map(noteHighlight => ({
        ...noteHighlight,
        highlights: noteHighlight.highlights.filter(highlight => highlight.id !== highlightId),
      })).filter(noteHighlight => noteHighlight.highlights.length > 0)
    );
  };
  
  const exportData = async () => {
    try {
      const data = {
        notes,
        highlights,
        exportDate: new Date().toISOString(),
      };
      
      const jsonData = JSON.stringify(data);
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return 'Data exported successfully';
      } else {
        // For mobile, we would use a file system API or share API
        // This is a simplified version
        return 'Export functionality for mobile is not implemented yet';
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  };
  
  const importData = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, create a file input
        return new Promise<void>((resolve, reject) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'application/json';
          
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
              reject(new Error('No file selected'));
              return;
            }
            
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const data = JSON.parse(event.target?.result as string);
                if (data.notes && data.highlights) {
                  setNotes(data.notes);
                  setHighlights(data.highlights);
                  await AsyncStorage.setItem('notes', JSON.stringify(data.notes));
                  await AsyncStorage.setItem('highlights', JSON.stringify(data.highlights));
                  resolve();
                } else {
                  reject(new Error('Invalid backup file'));
                }
              } catch (error) {
                reject(error);
              }
            };
            reader.readAsText(file);
          };
          
          input.click();
        });
      } else {
        // For mobile, we would use a file picker API
        // This is a simplified version
        throw new Error('Import functionality for mobile is not implemented yet');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  };
  
  return (
    <NoteContext.Provider
      value={{
        notes,
        highlights,
        getNote,
        createNote,
        updateNote,
        deleteNote,
        clearAllNotes,
        addHighlight,
        updateHighlight,
        deleteHighlight,
        exportData,
        importData,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};