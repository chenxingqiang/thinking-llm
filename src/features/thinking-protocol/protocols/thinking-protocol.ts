import { BaseProtocol } from './base-protocol';

export class ThinkingProtocol extends BaseProtocol {
    validateThinkingProcess(process: string): boolean {
        if (!this.checkBasicRequirements(process)) {
            return false;
        }

        // Check for natural language indicators
        const naturalLanguageIndicators = [
            'Hmm', 'This is interesting', 'Let me think',
            'Actually', 'I wonder if', 'This might mean'
        ];

        const hasNaturalLanguage = naturalLanguageIndicators.some(indicator =>
            process.includes(indicator)
        );

        // Check for minimum length
        const minLength = 100;
        const hasMinLength = process.length >= minLength;

        return hasNaturalLanguage && hasMinLength;
    }
} 