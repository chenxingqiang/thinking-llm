import { ProtocolConfig, ProtocolSection } from '../types/protocol-types';
import { DEFAULT_PROTOCOL } from '../configs/default-protocol';

export class ProtocolManager {
  private currentConfig: ProtocolConfig;
  private configHistory: ProtocolConfig[] = [];

  constructor(initialConfig: ProtocolConfig = DEFAULT_PROTOCOL) {
    this.currentConfig = initialConfig;
    this.configHistory.push(initialConfig);
  }

  getCurrentConfig(): ProtocolConfig {
    return this.currentConfig;
  }

  updateConfig(newConfig: Partial<ProtocolConfig>): void {
    this.configHistory.push(this.currentConfig);
    this.currentConfig = {
      ...this.currentConfig,
      ...newConfig,
      version: this.incrementVersion(this.currentConfig.version)
    };
  }

  addSection(categoryId: string, section: ProtocolSection): void {
    const updatedCategories = this.currentConfig.categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          sections: [...category.sections, section]
        };
      }
      return category;
    });

    this.updateConfig({ categories: updatedCategories });
  }

  removeSection(categoryId: string, sectionId: string): void {
    const updatedCategories = this.currentConfig.categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          sections: category.sections.filter(section => section.id !== sectionId)
        };
      }
      return category;
    });

    this.updateConfig({ categories: updatedCategories });
  }

  undoLastChange(): boolean {
    if (this.configHistory.length > 1) {
      this.configHistory.pop();
      this.currentConfig = this.configHistory[this.configHistory.length - 1];
      return true;
    }
    return false;
  }

  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  exportConfig(): string {
    return JSON.stringify(this.currentConfig, null, 2);
  }

  importConfig(configJson: string): void {
    try {
      const newConfig = JSON.parse(configJson) as ProtocolConfig;
      this.validateConfig(newConfig);
      this.updateConfig(newConfig);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Invalid configuration: ${error.message}`);
      }
      throw new Error('Invalid configuration: Unknown error');
    }
  }

  private validateConfig(config: ProtocolConfig): void {
    // Add validation logic here
    if (!config.id || !config.name || !config.categories) {
      throw new Error('Missing required configuration fields');
    }
  }
} 