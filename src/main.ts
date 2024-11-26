import './components/ProtocolConfigurator';
import { ProtocolManager } from './core/managers/protocol-manager';
import { ProtocolValidator } from './core/validators/protocol-validator';
import { ProtocolConfig } from './types';
import { DEFAULT_PROTOCOL } from './core/configs/default-protocol';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')!;
  
  app.innerHTML = `
    <div class="container">
      <h1>Thinking Protocol Configuration</h1>
      <protocol-configurator></protocol-configurator>
      <thinking-editor></thinking-editor>
    </div>
  `;

  // Initialize the protocol system
  const extendedConfig: ProtocolConfig = {
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
  };

  const manager = new ProtocolManager(extendedConfig);
  const config = manager.getCurrentConfig();
  const validator = new ProtocolValidator(config);

  // Example usage
  document.querySelector('thinking-editor')?.addEventListener('thinking-submitted', (e: any) => {
    const validationResults = validator.validateThinkingProcess(e.detail.content);
    console.log('Validation Results:', validationResults);
  });
}); 