export type { 
  AnalysisResult,
  Pattern,
  ValidationResult,
  ValidationRule,
  AdvancedMetrics,
  ProtocolConfig,
  ProtocolCategory,
  ProtocolSection,
  ThresholdConfig,
  ThinkingMetrics
} from './protocol-types';

export interface ThinkingPattern {
  type: PatternType;
  matches: PatternMatch[];
  frequency: number;
  significance: number;
}

export interface PatternMatch {
  text: string;
  position: number;
  context: string;
  strength: number;
}

export type PatternType = 
  | 'hypothesis_formation'
  | 'causal_reasoning'
  | 'comparative_analysis'
  | 'problem_decomposition'
  | 'solution_synthesis'
  | 'assumption_questioning'
  | 'evidence_evaluation'
  | 'alternative_exploration'
  | 'metacognition'
  | 'analogical_thinking';

export interface PatternAnalysis {
  patterns: ThinkingPattern[];
  dominantPatterns: PatternType[];
  patternDiversity: number;
  patternCoherence: number;
  patternProgression: string[];
} 