import { 
  ProtocolConfig, 
  ValidationResult,
  ThinkingMetrics 
} from '../types';

export class ProtocolValidator {
  constructor(private config: ProtocolConfig) {}

  validateThinkingProcess(content: string): ValidationResult {
    const metrics = this.calculateMetrics(content);
    const isValid = this.checkValidity(metrics);
    const suggestions = this.generateSuggestions(metrics);

    return {
      isValid,
      metrics,
      suggestions
    };
  }

  private calculateMetrics(text: string): ThinkingMetrics {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const naturalLanguageIndicators = this.findIndicators(
      text, 
      this.config.globalSettings.requiredIndicators.naturalLanguage
    );
    const progressiveIndicators = this.findIndicators(
      text, 
      this.config.globalSettings.requiredIndicators.progressiveThinking
    );
    const complexityIndicators = this.findIndicators(
      text, 
      this.config.globalSettings.requiredIndicators.complexity
    );

    const naturalLanguageScore = this.calculateScore(naturalLanguageIndicators.length, 3);
    const progressiveThinkingScore = this.calculateScore(progressiveIndicators.length, 3);
    const complexityScore = this.calculateScore(complexityIndicators.length, 2);

    return {
      wordCount,
      naturalLanguageScore,
      progressiveThinkingScore,
      complexityScore,
      overallScore: (naturalLanguageScore + progressiveThinkingScore + complexityScore) / 3,
      indicators: {
        naturalLanguage: naturalLanguageIndicators,
        progressiveThinking: progressiveIndicators,
        complexity: complexityIndicators,
      },
    };
  }

  private findIndicators(text: string, indicators: string[]): string[] {
    return indicators.filter(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  private calculateScore(count: number, target: number): number {
    return Math.min((count / target) * 10, 10);
  }

  private checkValidity(metrics: ThinkingMetrics): boolean {
    return (
      metrics.wordCount >= this.config.globalSettings.minWordCount &&
      metrics.naturalLanguageScore >= this.config.thresholds.naturalLanguageScore &&
      metrics.progressiveThinkingScore >= this.config.thresholds.progressiveThinkingScore &&
      metrics.complexityScore >= this.config.thresholds.complexityScore
    );
  }

  private generateSuggestions(metrics: ThinkingMetrics): string[] {
    const suggestions: string[] = [];

    if (metrics.wordCount < this.config.globalSettings.minWordCount) {
      suggestions.push(
        `Add more content (minimum ${this.config.globalSettings.minWordCount} words)`
      );
    }

    if (metrics.naturalLanguageScore < this.config.thresholds.naturalLanguageScore) {
      suggestions.push('Add more natural thinking indicators (e.g., "Hmm", "Let me think", "Interesting")');
    }

    if (metrics.progressiveThinkingScore < this.config.thresholds.progressiveThinkingScore) {
      suggestions.push('Show more progressive thinking (e.g., "Initially", "Upon further reflection", "This leads to")');
    }

    if (metrics.complexityScore < this.config.thresholds.complexityScore) {
      suggestions.push('Demonstrate more complex analysis (e.g., "However", "On the other hand", "Consider the implications")');
    }

    return suggestions;
  }
} 