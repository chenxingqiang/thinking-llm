export interface ThinkingStandard {
  id: string;
  name: string;
  description: string;
  weight: number;
  threshold: number;
  currentValue: number;
  indicators: string[];
}

export interface EvaluationResult {
  standardId: string;
  standardName: string;
  score: number;
  feedback: string;
  details: string[];
  overallScore?: number;
  passesThresholds?: boolean;
} 