import { ProtocolConfig } from '../types/protocol-types';

export const DEFAULT_PROTOCOL: ProtocolConfig = {
  id: 'default-thinking-protocol',
  name: 'Standard Thinking Protocol',
  description: 'Default configuration for thinking protocol validation',
  version: '1.0.0',
  globalSettings: {
    minNaturalLanguageIndicators: 3,
    requiredIndicators: {
      naturalLanguage: ['Hmm', 'Let me think', 'Interesting'],
      progressiveThinking: ['Initially', 'Then', 'Finally'],
      complexity: ['However', 'Although', 'Nevertheless']
    },
    optionalIndicators: [
      'Perhaps', 'Maybe', 'This reminds me of',
      'On second thought', 'Interestingly'
    ],
    minTotalWords: 100,
    minWordCount: 100
  },
  categories: [
    {
      id: 'initial-analysis',
      name: 'Initial Analysis',
      description: 'Initial analysis of the problem or situation',
      isRequired: true,
      order: 1,
      weight: 1,
      sections: [
        {
          id: 'problem-restatement',
          name: 'Problem Restatement',
          description: 'Clearly restate the problem in your own words',
          required: true,
          minWords: 20,
        },
        {
          id: 'initial-impressions',
          name: 'Initial Impressions',
          description: 'Form initial impressions about the problem',
          required: true,
          minWords: 30,
        }
      ]
    },
    {
      id: 'deep-analysis',
      name: 'Deep Analysis',
      description: 'Deeper analysis and exploration of the problem',
      isRequired: true,
      order: 2,
      weight: 2,
      sections: [
        {
          id: 'hypothesis-generation',
          name: 'Hypothesis Generation',
          description: 'Generate multiple possible explanations',
          required: true,
          minWords: 50,
        }
      ]
    }
  ],
  thresholds: {
    naturalLanguageScore: 7,
    progressiveThinkingScore: 7,
    complexityScore: 7,
    coherenceScore: 7,
    overallScore: 7
  },
  lastModified: new Date().toISOString()
}; 