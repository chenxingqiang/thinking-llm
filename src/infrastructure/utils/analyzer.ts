import { AnalysisResult, Pattern } from '../types';

export function analyzeThinking(text: string): AnalysisResult {
  const hasThinkingIndicators = text.includes('Hmm') || 
                               text.includes('let me think') ||
                               text.includes('interesting');
  
  const patterns: Pattern[] = [
    {
      name: 'Natural Language',
      score: hasThinkingIndicators ? 0.8 : 0.2,
      description: 'Use of natural thinking expressions'
    },
    {
      name: 'Depth of Analysis',
      score: text.length > 100 ? 0.7 : 0.3,
      description: 'Thoroughness of analysis'
    }
  ];

  return {
    score: hasThinkingIndicators ? 7 : 3,
    passesThreshold: hasThinkingIndicators,
    patterns,
    recommendations: hasThinkingIndicators ? [] : [
      'Try using more natural thinking expressions',
      'Show your thought process more explicitly'
    ]
  };
} 