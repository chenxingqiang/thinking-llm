import { AdvancedMetrics } from '../types/analysis-types';
import './AdvancedAnalysisPanel.css';

interface AdvancedAnalysisPanelProps {
  metrics: AdvancedMetrics;
}

export function AdvancedAnalysisPanel({ metrics }: AdvancedAnalysisPanelProps) {
  return (
    <div className="advanced-analysis">
      <h3>Advanced Analysis</h3>
      <div className="analysis-grid">
        <div className="cognitive-patterns">
          {metrics.cognitivePatterns.map(pattern => (
            <div key={pattern.type} className="pattern-item">
              <span>{pattern.type}: {pattern.confidence.toFixed(1)}</span>
            </div>
          ))}
        </div>
        <div className="sentiment-analysis">
          <p>Tone: {metrics.sentiment.tone}</p>
          <p>Score: {metrics.sentiment.score.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
} 