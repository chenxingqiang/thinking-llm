import { ProtocolConfig } from '@/types/protocol-types';

export const DEFAULT_PROTOCOL: ProtocolConfig = {
  lastModified: new Date().toISOString(),
  categories: [
    { name: 'Analysis', description: 'Analysis protocols', isRequired: true, order: 0, weight: 1 },
    { name: 'Design', description: 'Design protocols', isRequired: true, order: 1, weight: 1 },
    { name: 'Research', description: 'Research protocols', isRequired: true, order: 2, weight: 1 }
  ],
  globalSettings: {
    minWordCount: 100,
    requiredIndicators: {
      naturalLanguage: ['Hmm', 'Let me think', 'Interesting'],
      progressiveThinking: ['Initially', 'Then', 'Finally'],
      complexity: ['However', 'Although', 'Nevertheless']
    }
  },
  thresholds: {
    naturalLanguageScore: 7,
    progressiveThinkingScore: 7,
    complexityScore: 7,
    coherenceScore: 7,
    overallScore: 7
  }
}; 