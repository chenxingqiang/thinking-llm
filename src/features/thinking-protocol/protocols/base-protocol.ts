import { BaseModel } from '../models/base-model';

export abstract class BaseProtocol {
    constructor(protected model: BaseModel) {}
    
    abstract validateThinkingProcess(process: string): boolean;

    protected checkBasicRequirements(process: string): boolean {
        // Check if process contains required sections
        const requiredSections = [
            'Initial Engagement',
            'Problem Space Exploration',
            'Multiple Hypothesis Generation'
        ];

        return requiredSections.every(section => 
            process.toLowerCase().includes(section.toLowerCase())
        );
    }

    addProcess(content: string, category: string): void {
        const isValid = this.validateThinkingProcess(content);
        this.model.addThinkingProcess({
            content,
            category,
            isValid,
            timestamp: new Date()
        });
    }
} 