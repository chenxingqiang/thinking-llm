export interface ProtocolSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
  minWords?: number;
  maxWords?: number;
  indicators?: string[];
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

// ... rest of the interfaces ... 