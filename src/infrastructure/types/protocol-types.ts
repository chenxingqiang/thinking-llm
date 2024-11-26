export interface ThinkingMetrics {
  wordCount: number;
  naturalLanguageScore: number;
  progressiveThinkingScore: number;
  complexityScore: number;
  overallScore: number;
  indicators: {
    naturalLanguage: string[];
    progressiveThinking: string[];
    complexity: string[];
  };
}

export interface ValidationResult {
  isValid: boolean;
  metrics: ThinkingMetrics;
  suggestions: string[];
}

export interface ProtocolConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  categories: ProtocolCategory[];
  globalSettings: {
    minNaturalLanguageIndicators: number;
    requiredIndicators: {
      naturalLanguage: string[];
      progressiveThinking: string[];
      complexity: string[];
    };
    optionalIndicators: string[];
    minTotalWords: number;
    minWordCount: number;
  };
  thresholds: ThresholdConfig;
  lastModified: string;
}

export interface ThresholdConfig {
  naturalLanguageScore: number;
  progressiveThinkingScore: number;
  complexityScore: number;
  coherenceScore: number;
  overallScore: number;
}

export interface ProtocolCategory {
  id: string;
  name: string;
  description: string;
  sections: ProtocolSection[];
  isRequired: boolean;
  order: number;
  weight: number;
}

export interface ProtocolSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
  minWords?: number;
  examples?: string[];
  indicators?: string[];
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  type: 'minWords' | 'maxWords' | 'required' | 'pattern';
  value: string | number | boolean;
  message: string;
}

export interface AnalysisResult {
  score: number;
  passesThreshold: boolean;
  patterns: Pattern[];
  recommendations: string[];
}

export interface Pattern {
  name: string;
  score: number;
  description: string;
}

export interface AdvancedMetrics {
  cognitivePatterns: CognitivePattern[];
  thinkingFlow: ThinkingFlow[];
  sentiment: SentimentAnalysis;
  coherenceScore: number;
  depthScore: number;
  clarityScore: number;
}

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

export { DEFAULT_PROTOCOL } from '../core/configs/default-protocol'; 