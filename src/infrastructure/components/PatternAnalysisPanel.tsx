import { PatternAnalysis, ThinkingPattern } from '../types/pattern-types';
import './PatternAnalysisPanel.css';

interface PatternAnalysisPanelProps {
  analysis: PatternAnalysis;
}

export function PatternAnalysisPanel({ analysis }: PatternAnalysisPanelProps) {
  return (
    <div className="pattern-analysis-panel">
      <h3>Thinking Pattern Analysis</h3>

      <div className="pattern-summary">
        <div className="metric-card">
          <h4>Pattern Diversity</h4>
          <div className="metric-value">{analysis.patternDiversity.toFixed(1)}/10</div>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ width: `${analysis.patternDiversity * 10}%` }}
            />
          </div>
        </div>

        <div className="metric-card">
          <h4>Pattern Coherence</h4>
          <div className="metric-value">{analysis.patternCoherence.toFixed(1)}/10</div>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ width: `${analysis.patternCoherence * 10}%` }}
            />
          </div>
        </div>
      </div>

      <div className="dominant-patterns">
        <h4>Dominant Patterns</h4>
        <div className="pattern-tags">
          {analysis.dominantPatterns.map((pattern, index) => (
            <span key={index} className="pattern-tag">
              {pattern.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="pattern-progression">
        <h4>Thinking Progression</h4>
        <div className="progression-types">
          {analysis.patternProgression.map((type, index) => (
            <div key={index} className="progression-type">
              <span className="type-label">{type}</span>
              <span className="type-indicator" />
            </div>
          ))}
        </div>
      </div>

      <div className="pattern-details">
        <h4>Detailed Pattern Analysis</h4>
        {analysis.patterns
          .filter(pattern => pattern.matches.length > 0)
          .sort((a, b) => b.significance - a.significance)
          .map((pattern, index) => (
            <PatternCard key={index} pattern={pattern} />
          ))}
      </div>
    </div>
  );
}

interface PatternCardProps {
  pattern: ThinkingPattern;
}

function PatternCard({ pattern }: PatternCardProps) {
  return (
    <div className="pattern-card">
      <div className="pattern-header">
        <h5>{pattern.type.replace('_', ' ')}</h5>
        <span className="pattern-significance">
          {pattern.significance.toFixed(1)}
        </span>
      </div>
      
      <div className="pattern-matches">
        {pattern.matches.map((match, index) => (
          <div key={index} className="match-item">
            <div className="match-context">
              <span className="context-before">{match.context}</span>
              <span className="match-text">{match.text}</span>
            </div>
            <span className="match-strength">
              {(match.strength * 10).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 