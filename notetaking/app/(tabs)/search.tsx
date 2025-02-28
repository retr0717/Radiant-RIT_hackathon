import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X, ExternalLink } from 'lucide-react-native';
import { useNotes } from '@/context/NoteContext';
import { searchWithAI } from '@/utils/aiUtils';

export default function SearchScreen() {
  const { notes, highlights } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const allHighlights = highlights.flatMap(highlight => 
    highlight.highlights.map(h => ({
      ...h,
      noteId: highlight.noteId,
      noteTitle: notes.find(note => note.id === highlight.noteId)?.title || 'Untitled Note'
    }))
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchWithAI(searchQuery, allHighlights);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHighlight = ({ item }) => (
    <View style={styles.highlightCard}>
      <View style={styles.highlightHeader}>
        <Text style={styles.highlightSource}>From: {item.noteTitle}</Text>
        <View 
          style={[
            styles.colorIndicator, 
            { backgroundColor: item.color || '#6366f1' }
          ]} 
        />
      </View>
      <Text style={styles.highlightText}>{item.text}</Text>
      {item.aiInfo && (
        <View style={styles.aiInfoContainer}>
          <Text style={styles.aiInfoTitle}>AI Insights:</Text>
          <Text style={styles.aiInfoText}>{item.aiInfo}</Text>
          {item.sourceUrl && (
            <TouchableOpacity style={styles.sourceLink}>
              <ExternalLink size={16} color="#6366f1" />
              <Text style={styles.sourceLinkText}>Learn more</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Text style={styles.title}>Smart Search</Text>
      <Text style={styles.subtitle}>
        Search through your highlighted text and get AI-powered insights
      </Text>
      
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for concepts, ideas, or keywords..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={isLoading || !searchQuery.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.searchButtonText}>Search with AI</Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!isLoading && searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `result-${index}`}
          renderItem={renderHighlight}
          contentContainerStyle={styles.resultsList}
        />
      ) : !isLoading && searchQuery && !error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No results found. Try a different search term or highlight more text in your notes.
          </Text>
        </View>
      ) : !searchQuery ? (
        <View style={styles.initialState}>
          <Text style={styles.initialStateText}>
            Search through your highlighted text to find information and get AI-powered insights.
          </Text>
          {allHighlights.length === 0 && (
            <Text style={styles.noHighlightsText}>
              You haven't highlighted any text yet. Highlight important text in your notes to use this feature.
            </Text>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  searchButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultsList: {
    paddingBottom: 16,
  },
  highlightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightSource: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  highlightText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  aiInfoContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
  },
  aiInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  aiInfoText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLinkText: {
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 4,
    fontWeight: '500',
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
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  initialStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  noHighlightsText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});