import React, { useState, ChangeEvent } from 'react';
import { ProtocolManager } from '../utils/protocol-manager.ts';
import { ProtocolConfig, ProtocolSection, ProtocolCategory, DEFAULT_PROTOCOL } from '../types/protocol-types.ts';
import './ProtocolConfigurator.css';

interface ProtocolConfiguratorProps {
  onConfigChange: (config: ProtocolConfig) => void;
}

export function ProtocolConfigurator({ onConfigChange }: ProtocolConfiguratorProps) {
  const [manager] = useState(() => new ProtocolManager(DEFAULT_PROTOCOL));
  const [config, setConfig] = useState<ProtocolConfig>(DEFAULT_PROTOCOL);

  const handleSectionUpdate = (
    categoryIndex: number,
    sectionIndex: number,
    updates: Partial<ProtocolSection>
  ) => {
    manager.updateSection(categoryIndex, sectionIndex, updates);
    const newConfig = manager.getConfig();
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleExport = () => {
    const configData = manager.exportConfig();
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'thinking-protocol-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        manager.importConfig(content);
        const newConfig = manager.getConfig();
        setConfig(newConfig);
        onConfigChange(newConfig);
      } catch (error) {
        console.error('Failed to import configuration:', error);
        alert('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };

  const renderCategoryEditor = (category: ProtocolCategory, categoryIndex: number) => (
    <div key={categoryIndex} className="category-editor">
      <h3>{category.name}</h3>
      {category.sections.map((section: ProtocolSection, sectionIndex: number) => (
        renderSectionEditor(section, categoryIndex, sectionIndex)
      ))}
    </div>
  );

  const renderSectionEditor = (
    section: ProtocolSection,
    categoryIndex: number,
    sectionIndex: number
  ) => (
    <div key={sectionIndex} className="section-editor">
      <input
        type="text"
        value={section.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleSectionUpdate(
          categoryIndex,
          sectionIndex,
          { name: e.target.value }
        )}
        className="section-title"
      />
      <textarea
        value={section.description}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleSectionUpdate(
          categoryIndex,
          sectionIndex,
          { description: e.target.value }
        )}
        className="section-content"
      />
      <label>
        <input
          type="checkbox"
          checked={section.required}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSectionUpdate(
            categoryIndex,
            sectionIndex,
            { required: e.target.checked }
          )}
        />
        Required
      </label>
    </div>
  );

  return (
    <div className="protocol-configurator">
      <div className="config-actions">
        <button onClick={handleExport}>Export Configuration</button>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="import-input"
        />
      </div>
      
      <div className="config-editor">
        {config.categories.map((category, index) => 
          renderCategoryEditor(category, index)
        )}
      </div>
    </div>
  );
} 