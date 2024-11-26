import { 
  ProtocolConfig, 
  ProtocolSection, 
  ProtocolCategory,
  ValidationRule 
} from '../types';
import { ProtocolManager } from '../utils/protocol-manager';
import { DEFAULT_PROTOCOL } from '../core/configs/default-protocol';

export class ProtocolConfigurator extends HTMLElement {
  private manager: ProtocolManager;
  private config: ProtocolConfig;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
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

    this.manager = new ProtocolManager(extendedConfig);
    this.config = this.manager.getConfig();
    this.initialize();
  }

  private initialize() {
    this.render();
    this.setupEventListeners();
    this.setupValidation();
  }

  private setupValidation() {
    const validateInput = (input: HTMLElement, rules: ValidationRule[]) => {
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
        return false;
      }
      const value = input.value;
      for (const rule of rules) {
        switch (rule.type) {
          case 'minWords':
            if (value.split(/\s+/).length < Number(rule.value)) {
              input.setCustomValidity(rule.message);
              return false;
            }
            break;
          case 'required':
            if (rule.value && !value.trim()) {
              input.setCustomValidity(rule.message);
              return false;
            }
            break;
          case 'pattern':
            if (typeof rule.value === 'string' && !new RegExp(rule.value).test(value)) {
              input.setCustomValidity(rule.message);
              return false;
            }
            break;
        }
      }
      input.setCustomValidity('');
      return true;
    };

    this.shadowRoot!.querySelectorAll('input, textarea').forEach(element => {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const sectionId = element.closest('.section')?.getAttribute('data-id');
        if (sectionId) {
          const section = this.findSection(sectionId);
          if (section) {
            element.addEventListener('input', () => {
              validateInput(element, section.validationRules || []);
            });
          }
        }
      }
    });
  }

  private findSection(id: string): ProtocolSection | null {
    for (const category of this.config.categories) {
      const section = category.sections.find(s => s.id === id);
      if (section) return section;
    }
    return null;
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .category {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
        }
        .section {
          margin: 1rem 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .validation-error {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        /* ... more styles ... */
      </style>
      
      ${this.renderConfig()}
    `;
  }

  private renderConfig() {
    return `
      <div class="protocol-config">
        <header>
          <h2>${this.config.name} v${this.config.version}</h2>
          <p>Last modified: ${new Date(this.config.lastModified).toLocaleString()}</p>
        </header>

        ${this.renderGlobalSettings()}
        ${this.renderCategoriesList()}
        ${this.renderActions()}
      </div>
    `;
  }

  private renderGlobalSettings() {
    return `
      <div class="global-settings">
        <h3>Global Settings</h3>
        <div>
          <label>
            Min Natural Language Indicators:
            <input type="number" 
                   name="minIndicators" 
                   value="${this.config.globalSettings.minNaturalLanguageIndicators}">
          </label>
        </div>
        <div>
          <label>
            Min Total Words:
            <input type="number" 
                   name="minWords" 
                   value="${this.config.globalSettings.minTotalWords}">
          </label>
        </div>
      </div>
    `;
  }

  private renderCategoriesList(): string {
    return `
      <div class="categories">
        ${this.renderCategoryItems(this.config)}
      </div>
    `;
  }

  private renderCategoryItems(config: ProtocolConfig): string {
    return config.categories.map((category: ProtocolCategory) => `
      <div class="category" data-id="${category.id}">
        <h3>${category.name}</h3>
        <div class="sections">
          ${category.sections.map(section => this.renderSection(section)).join('')}
        </div>
        <button class="add-section" data-category="${category.id}">
          Add Section
        </button>
      </div>
    `).join('');
  }

  private renderSection(section: ProtocolSection): string {
    return `
      <div class="section" data-id="${section.id}">
        <h4>${section.name}</h4>
        <p>${section.description}</p>
        <label>
          Required:
          <input type="checkbox" 
                 ${section.required ? 'checked' : ''} 
                 data-field="required">
        </label>
        <label>
          Min Words:
          <input type="number" 
                 value="${section.minWords || 0}" 
                 data-field="minWords">
        </label>
      </div>
    `;
  }

  private renderActions() {
    return `
      <div class="actions">
        <button id="export">Export Configuration</button>
        <button id="import">Import Configuration</button>
        <button id="reset">Reset to Default</button>
      </div>
    `;
  }

  private setupEventListeners() {
    const exportButton = this.shadowRoot!.querySelector('#export');
    const importButton = this.shadowRoot!.querySelector('#import');
    const resetButton = this.shadowRoot!.querySelector('#reset');

    exportButton?.addEventListener('click', () => {
      const configJson = this.manager.exportConfig();
      console.log('Exported configuration:', configJson);
    });

    importButton?.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.addEventListener('change', () => {
        const files = input.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const configJson = event.target?.result as string;
          this.manager.importConfig(configJson);
          this.render();
        };
        reader.readAsText(file);
      });
      input.click();
    });

    resetButton?.addEventListener('click', () => {
      this.manager.importConfig(JSON.stringify(DEFAULT_PROTOCOL));
      this.render();
    });
  }
} 