import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, X, Trash2 } from 'lucide-react-native';
import { useNotes } from '@/context/NoteContext';
import { formatDate } from '@/utils/dateUtils';

export default function NotesScreen() {
  const router = useRouter();
  const { notes, createNote, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredNotes = searchQuery
    ? notes.filter(note => 
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const sortedNotes = [...filteredNotes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleCreateNote = () => {
    const newNoteId = createNote();
    router.push(`/note/${newNoteId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        {isSearching ? (
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>All Notes</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setIsSearching(true)}
              >
                <Search size={24} color="#1e293b" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateNote}
              >
                <Plus size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {sortedNotes.length > 0 ? (
        <FlatList
          data={sortedNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.noteCard}
              onPress={() => router.push(`/note/${item.id}`)}
            >
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {item.title || 'Untitled Note'}
                </Text>
                <Text style={styles.noteDate}>
                  {formatDate(item.updatedAt)}
                </Text>
                <Text style={styles.notePreview} numberOfLines={2}>
                  {item.content || 'No content'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  deleteNote(item.id);
                }}
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          {searchQuery ? (
            <Text style={styles.emptyStateText}>No notes match your search.</Text>
          ) : (
            <>
              <Text style={styles.emptyStateText}>No notes yet. Create your first note!</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={handleCreateNote}
              >
                <Text style={styles.emptyStateButtonText}>Create Note</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
  },
  createButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  listContent: {
    paddingBottom: 16,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#475569',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});