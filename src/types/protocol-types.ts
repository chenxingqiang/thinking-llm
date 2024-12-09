export interface ProtocolConfig {
  categories: ProtocolCategory[];
  globalSettings: GlobalSettings;
  thresholds: Thresholds;
  lastModified: string;
}

interface ProtocolCategory {
  name: string;
  description: string;
  isRequired: boolean;
  order: number;
  weight: number;
}

interface GlobalSettings {
  minWordCount: number;
  requiredIndicators: {
    naturalLanguage: string[];
    progressiveThinking: string[];
    complexity: string[];
  };
}

interface Thresholds {
  naturalLanguageScore: number;
  progressiveThinkingScore: number;
  complexityScore: number;
  coherenceScore: number;
  overallScore: number;
} 