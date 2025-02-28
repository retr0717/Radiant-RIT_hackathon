import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Folder, Clock } from 'lucide-react-native';
import { useNotes } from '@/context/NoteContext';
import { formatDate } from '@/utils/dateUtils';

export default function HomeScreen() {
  const router = useRouter();
  const { notes, createNote } = useNotes();
  
  const recentNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  const handleCreateNote = () => {
    const newNoteId = createNote();
    router.push(`/note/${newNoteId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateNote}
        >
          <Plus size={24} color="#ffffff" />
          <Text style={styles.createButtonText}>New Note</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Folder size={24} color="#6366f1" />
          <Text style={styles.statNumber}>{notes.length}</Text>
          <Text style={styles.statLabel}>Total Notes</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#6366f1" />
          <Text style={styles.statNumber}>{recentNotes.length}</Text>
          <Text style={styles.statLabel}>Recent Notes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notes</Text>
        {recentNotes.length > 0 ? (
          <FlatList
            data={recentNotes}
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
                {item.hasDrawing && (
                  <View style={styles.thumbnailContainer}>
                    <Image 
                      source={{ uri: item.drawingThumbnail }} 
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No notes yet. Create your first note!</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={handleCreateNote}
            >
              <Text style={styles.emptyStateButtonText}>Create Note</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
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
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
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