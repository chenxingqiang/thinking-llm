export interface ProtocolConfig {
  minWordCount: number;
  maxWordCount: number;
  requiredSections: string[];
  keywordThreshold: number;
  globalSettings: {
    minLength: number;
    maxLength: number;
    minSections: number;
  };
  thresholds: {
    naturalLanguage: number;
    progressiveThinking: number;
    complexity: number;
  };
}

export interface ThinkingMetrics {
  wordCount: number;
  sectionCount: number;
  keywordDensity: number;
  completedSections: string[];
  naturalLanguageScore: number;
  progressiveThinkingScore: number;
  complexityScore: number;
}

export interface ValidationResult {
  isValid: boolean;
  metrics: ThinkingMetrics;
  suggestions: string[];
}
