import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Trash2, Pencil, Type, Palette, Download } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useNotes } from '@/context/NoteContext';
import DrawingCanvas from '@/components/DrawingCanvas';
import RichTextEditor from '@/components/RichTextEditor';
import ColorPicker from '@/components/ColorPicker';
import { convertToText } from '@/utils/ocrUtils';
import { exportToPDF } from '@/utils/pdfUtils';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getNote, updateNote, deleteNote } = useNotes();
  const note = getNote(id as string);
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [mode, setMode] = useState<'text' | 'drawing'>('text');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [paths, setPaths] = useState(note?.paths || []);
  
  const canvasRef = useRef(null);
  const editorRef = useRef(null);
  
  useEffect(() => {
    // Auto-save changes every 2 seconds
    const saveInterval = setInterval(() => {
      handleSave();
    }, 2000);
    
    return () => clearInterval(saveInterval);
  }, [title, content, paths]);
  
  const handleSave = () => {
    if (!note) return;
    
    updateNote(id as string, {
      title,
      content,
      paths,
      hasDrawing: paths.length > 0,
      updatedAt: new Date().toISOString(),
    });
  };
  
  const handleDelete = () => {
    deleteNote(id as string);
    router.back();
  };
  
  const handleBack = () => {
    handleSave();
    router.back();
  };
  
  const handleConvertToText = async () => {
    if (!canvasRef.current || paths.length === 0) return;
    
    try {
      const result = await convertToText(canvasRef.current);
      if (result) {
        setContent(prev => prev ? `${prev}\n\n${result}` : result);
        setMode('text');
      }
    } catch (error) {
      console.error('OCR error:', error);
    }
  };
  
  const handleExportToPDF = async () => {
    try {
      await exportToPDF([note]);
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };
  
  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Note not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Untitled Note"
              placeholderTextColor="#94a3b8"
            />
            <Text style={styles.dateText}>
              {new Date(note.updatedAt).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              <Save size={24} color="#1e293b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Trash2 size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.toolbar}>
          <TouchableOpacity 
            style={[styles.toolbarButton, mode === 'text' && styles.activeToolbarButton]}
            onPress={() => setMode('text')}
          >
            <Type size={20} color={mode === 'text' ? '#ffffff' : '#1e293b'} />
            <Text style={[styles.toolbarButtonText, mode === 'text' && styles.activeToolbarButtonText]}>
              Text
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toolbarButton, mode === 'drawing' && styles.activeToolbarButton]}
            onPress={() => setMode('drawing')}
          >
            <Pencil size={20} color={mode === 'drawing' ? '#ffffff' : '#1e293b'} />
            <Text style={[styles.toolbarButtonText, mode === 'drawing' && styles.activeToolbarButtonText]}>
              Draw
            </Text>
          </TouchableOpacity>
          
          {mode === 'drawing' && (
            <>
              <TouchableOpacity 
                style={styles.toolbarButton}
                onPress={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette size={20} color="#1e293b" />
                <View style={[styles.colorIndicator, { backgroundColor: currentColor }]} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.toolbarButton}
                onPress={handleConvertToText}
              >
                <Type size={20} color="#1e293b" />
                <Text style={styles.toolbarButtonText}>Convert</Text>
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={handleExportToPDF}
          >
            <Download size={20} color="#1e293b" />
            <Text style={styles.toolbarButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
        
        {showColorPicker && (
          <Animated.View 
            style={styles.colorPickerContainer}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <ColorPicker
              selectedColor={currentColor}
              onSelectColor={(color) => {
                setCurrentColor(color);
                setShowColorPicker(false);
              }}
              onSelectStrokeWidth={(width) => {
                setStrokeWidth(width);
              }}
              currentStrokeWidth={strokeWidth}
            />
          </Animated.View>
        )}
        
        <View style={styles.contentContainer}>
          {mode === 'text' ? (
            <ScrollView style={styles.scrollView}>
              <RichTextEditor
                ref={editorRef}
                initialContent={content}
                onChange={setContent}
              />
            </ScrollView>
          ) : (
            <DrawingCanvas
              ref={canvasRef}
              color={currentColor}
              strokeWidth={strokeWidth}
              paths={paths}
              onPathsChange={setPaths}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  activeToolbarButton: {
    backgroundColor: '#6366f1',
  },
  toolbarButtonText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 4,
  },
  activeToolbarButtonText: {
    color: '#ffffff',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  colorPickerContainer: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
});