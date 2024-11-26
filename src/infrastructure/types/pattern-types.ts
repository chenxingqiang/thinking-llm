export interface ThinkingPattern {
  type: PatternType;
  matches: PatternMatch[];
  frequency: number;
  significance: number;
  position?: number;
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

export interface PatternContext {
  before: string;
  match: string;
  after: string;
}

export interface PatternAnalysis {
  patterns: ThinkingPattern[];
  dominantPatterns: PatternType[];
  patternDiversity: number;
  patternCoherence: number;
  patternProgression: PatternProgressionType[];
}

export type PatternProgressionType = 
  | 'linear'
  | 'cyclical'
  | 'branching'
  | 'iterative'
  | 'convergent'; 