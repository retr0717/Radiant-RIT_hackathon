import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Highlighter } from 'lucide-react-native';
import { useNotes } from '@/context/NoteContext';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

interface EditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
}

const RichTextEditor = forwardRef<EditorRef, RichTextEditorProps>(
  ({ initialContent, onChange }, ref) => {
    const [content, setContent] = useState(initialContent || '');
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [showHighlightColors, setShowHighlightColors] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const { addHighlight } = useNotes();
    
    const highlightColors = [
      '#fef08a', // Yellow
      '#bae6fd', // Light Blue
      '#bbf7d0', // Light Green
      '#fecaca', // Light Red
      '#e9d5ff', // Light Purple
    ];
    
    useImperativeHandle(ref, () => ({
      getContent: () => content,
      setContent: (newContent: string) => {
        setContent(newContent);
        onChange(newContent);
      },
      focus: () => inputRef.current?.focus(),
    }));
    
    const applyStyle = (style: string) => {
      if (selection.start === selection.end) return;
      
      const selectedText = content.substring(selection.start, selection.end);
      let newContent = '';
      
      switch (style) {
        case 'bold':
          newContent = content.substring(0, selection.start) + 
                      `**${selectedText}**` + 
                      content.substring(selection.end);
          break;
        case 'italic':
          newContent = content.substring(0, selection.start) + 
                      `_${selectedText}_` + 
                      content.substring(selection.end);
          break;
        case 'underline':
          newContent = content.substring(0, selection.start) + 
                      `~${selectedText}~` + 
                      content.substring(selection.end);
          break;
        case 'list':
          newContent = content.substring(0, selection.start) + 
                      `\n- ${selectedText}` + 
                      content.substring(selection.end);
          break;
        case 'align-left':
        case 'align-center':
        case 'align-right':
          // In a real implementation, we would handle alignment differently
          // For now, we'll just add a marker
          newContent = content.substring(0, selection.start) + 
                      `[${style}]${selectedText}[/${style}]` + 
                      content.substring(selection.end);
          break;
        default:
          return;
      }
      
      setContent(newContent);
      onChange(newContent);
    };
    
    const applyHighlight = (color: string) => {
      if (selection.start === selection.end) return;
      
      const selectedText = content.substring(selection.start, selection.end);
      const highlightId = Math.random().toString(36).substring(2, 9);
      
      const newContent = content.substring(0, selection.start) + 
                        `[highlight id="${highlightId}" color="${color}"]${selectedText}[/highlight]` + 
                        content.substring(selection.end);
      
      // Add to highlights in context
      addHighlight({
        id: highlightId,
        text: selectedText,
        color: color,
      });
      
      setContent(newContent);
      onChange(newContent);
      setShowHighlightColors(false);
    };
    
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('bold')}>
            <Bold size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('italic')}>
            <Italic size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('underline')}>
            <Underline size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('list')}>
            <List size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('align-left')}>
            <AlignLeft size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('align-center')}>
            <AlignCenter size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => applyStyle('align-right')}>
            <AlignRight size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolbarButton} 
            onPress={() => setShowHighlightColors(!showHighlightColors)}
          >
            <Highlighter size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>
        
        {showHighlightColors && (
          <View style={styles.highlightColorsContainer}>
            {highlightColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, { backgroundColor: color }]}
                onPress={() => applyHighlight(color)}
              />
            ))}
          </View>
        )}
        
        <TextInput
          ref={inputRef}
          style={styles.editor}
          value={content}
          onChangeText={(text) => {
            setContent(text);
            onChange(text);
          }}
          multiline
          autoCapitalize="sentences"
          onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
          placeholder="Start typing..."
          placeholderTextColor="#94a3b8"
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  toolbarButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  highlightColorsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  editor: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    textAlignVertical: 'top',
  },
});

export default RichTextEditor;