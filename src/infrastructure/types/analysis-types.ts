export interface CognitivePattern {
  type: 'analytical' | 'creative' | 'critical' | 'practical' | 'reflective';
  confidence: number;
  examples: string[];
}

export interface ThinkingFlow {
  stage: 'initial' | 'exploration' | 'analysis' | 'synthesis' | 'conclusion';
  content: string;
  strength: number;
}

export interface SentimentAnalysis {
  tone: 'neutral' | 'uncertain' | 'confident' | 'questioning' | 'concluding';
  score: number;
  keywords: string[];
}

export interface AdvancedMetrics {
  cognitivePatterns: CognitivePattern[];
  thinkingFlow: ThinkingFlow[];
  sentiment: SentimentAnalysis;
  coherenceScore: number;
  depthScore: number;
  clarityScore: number;
} 