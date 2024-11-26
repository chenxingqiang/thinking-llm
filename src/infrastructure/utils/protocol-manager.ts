import { ProtocolConfig, ProtocolSection } from '../types/protocol-types';

export class ProtocolManager {
  private config: ProtocolConfig;

  constructor(initialConfig: ProtocolConfig) {
    this.config = JSON.parse(JSON.stringify(initialConfig)); // Deep clone
  }

  getConfig(): ProtocolConfig {
    return JSON.parse(JSON.stringify(this.config)); // Return a copy
  }

  updateSection(
    categoryIndex: number, 
    sectionIndex: number, 
    updates: Partial<ProtocolSection>
  ): void {
    if (
      this.config.categories[categoryIndex] && 
      this.config.categories[categoryIndex].sections[sectionIndex]
    ) {
      Object.assign(
        this.config.categories[categoryIndex].sections[sectionIndex],
        updates
      );
    }
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configData: string): void {
    try {
      const parsed = JSON.parse(configData);
      this.validateConfig(parsed);
      this.config = parsed;
    } catch (error) {
      throw new Error('Invalid protocol configuration format');
    }
  }

  private validateConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration format');
    }

    if (!Array.isArray(config.categories)) {
      throw new Error('Categories must be an array');
    }

    for (const category of config.categories) {
      if (!category.name || !Array.isArray(category.sections)) {
        throw new Error('Invalid category format');
      }

      for (const section of category.sections) {
        if (!section.title || typeof section.content !== 'string') {
          throw new Error('Invalid section format');
        }
      }
    }
  }
} 