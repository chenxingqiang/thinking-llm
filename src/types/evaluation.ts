/**
 * Metrics for evaluating thinking process quality
 */
export interface ThinkingMetrics {
  /** Overall score between 0 and 1 */
  overallScore: number;
  
  /** Score for natural language usage between 0 and 1 */
  naturalLanguageScore: number;
  
  /** Score for structural organization between 0 and 1 */
  structureScore: number;
  
  /** Score for comprehensiveness between 0 and 1 */
  comprehensivenessScore: number;
  
  /** Whether the thinking meets minimum standards */
  meetsStandards: boolean;
  
  /** Array of feedback messages */
  feedback: string[];
} 