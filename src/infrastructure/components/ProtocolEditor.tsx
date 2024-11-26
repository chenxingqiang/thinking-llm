import { useState } from 'react';
import { ProtocolConfig, ValidationResult, AnalysisResult } from '../types';
import { DEFAULT_PROTOCOL } from '../core/configs/default-protocol';
import { AnalysisPanel } from './AnalysisPanel';

const ProtocolEditor = () => {
  const [_config] = useState<ProtocolConfig>(() => ({
    ...DEFAULT_PROTOCOL,
    categories: DEFAULT_PROTOCOL.categories.map(cat => ({
      ...cat,
      description: cat.name,
      isRequired: true,
      order: 0,
      weight: 1
    })),
    globalSettings: {
      ...DEFAULT_PROTOCOL.globalSettings,
      minWordCount: 100,
      requiredIndicators: {
        naturalLanguage: ['Hmm', 'Let me think', 'Interesting'],
        progressiveThinking: ['Initially', 'Then', 'Finally'],
        complexity: ['However', 'Although', 'Nevertheless']
      }
    },
    thresholds: {
      naturalLanguageScore: 7,
      progressiveThinkingScore: 7,
      complexityScore: 7,
      coherenceScore: 7,
      overallScore: 7
    },
    lastModified: new Date().toISOString()
  }));

  const [validation] = useState<ValidationResult | null>(null);

  const validationToAnalysis = (val: ValidationResult): AnalysisResult => ({
    score: val.metrics.overallScore,
    passesThreshold: val.isValid,
    patterns: [],
    recommendations: val.suggestions
  });

  return (
    <div>
      {validation && <AnalysisPanel analysis={validationToAnalysis(validation)} />}
    </div>
  );
};

export { ProtocolEditor }; 