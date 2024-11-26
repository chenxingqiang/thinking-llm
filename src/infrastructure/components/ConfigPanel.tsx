import { ProtocolConfig, ThresholdConfig } from '../types/protocol-types';
import './ConfigPanel.css';

interface ConfigPanelProps {
  config: ProtocolConfig;
  onConfigChange: (newConfig: ProtocolConfig) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const handleThresholdChange = (key: keyof ThresholdConfig, value: number) => {
    onConfigChange({
      ...config,
      thresholds: {
        ...config.thresholds,
        [key]: value
      }
    });
  };

  const handleMinWordCountChange = (value: number) => {
    onConfigChange({
      ...config,
      globalSettings: {
        ...config.globalSettings,
        minWordCount: value
      }
    });
  };

  return (
    <div className="config-panel">
      <h3>Configuration</h3>
      
      <div className="config-section">
        <h4>Thresholds</h4>
        <div className="threshold-controls">
          <div className="control-group">
            <label>Minimum Word Count</label>
            <input
              type="range"
              min="10"
              max="200"
              value={config.globalSettings.minWordCount}
              onChange={(e) => handleMinWordCountChange(Number(e.target.value))}
            />
            <span className="value">{config.globalSettings.minWordCount}</span>
          </div>
          
          <div className="control-group">
            <label>Natural Language Score</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.thresholds.naturalLanguageScore}
              onChange={(e) => handleThresholdChange('naturalLanguageScore', Number(e.target.value))}
            />
            <span className="value">{config.thresholds.naturalLanguageScore}</span>
          </div>
          
          <div className="control-group">
            <label>Progressive Thinking Score</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.thresholds.progressiveThinkingScore}
              onChange={(e) => handleThresholdChange('progressiveThinkingScore', Number(e.target.value))}
            />
            <span className="value">{config.thresholds.progressiveThinkingScore}</span>
          </div>
          
          <div className="control-group">
            <label>Complexity Score</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.thresholds.complexityScore}
              onChange={(e) => handleThresholdChange('complexityScore', Number(e.target.value))}
            />
            <span className="value">{config.thresholds.complexityScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 