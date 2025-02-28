import { Highlight } from '@/context/NoteContext';

// This is a mock implementation of AI search
// In a real app, you would connect to an actual AI API
export const searchWithAI = async (query: string, highlights: Highlight[]): Promise<Highlight[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple search implementation
  const matchedHighlights = highlights.filter(highlight => 
    highlight.text.toLowerCase().includes(query.toLowerCase())
  );
  
  // Add mock AI information to the results
  return matchedHighlights.map(highlight => ({
    ...highlight,
    aiInfo: generateMockAIResponse(highlight.text, query),
    sourceUrl: Math.random() > 0.5 ? 'https://example.com/learn-more' : undefined,
  }));
};

// Generate a mock AI response
const generateMockAIResponse = (text: string, query: string): string => {
  const responses = [
    `This highlighted text relates to "${query}" because it discusses key concepts in this domain.`,
    `Based on my analysis, this text contains important information about "${query}" that you might find useful.`,
    `This highlight appears to be discussing aspects of "${query}" that are relevant to your search.`,
    `I found connections between this text and "${query}" that suggest this is a valuable reference.`,
    `This text contains terminology and concepts related to "${query}" that match your search criteria.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};