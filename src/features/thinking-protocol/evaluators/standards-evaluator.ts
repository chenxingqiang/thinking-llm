import { ThinkingStandard, EvaluationResult } from '../types';
import { DEFAULT_STANDARDS } from '../types/protocol-standards';

export class StandardsEvaluator {
  private standards: ThinkingStandard[];

  constructor(standards = DEFAULT_STANDARDS.categories[0].standards) {
    this.standards = standards;
  }

  evaluateThinkingProcess(text: string): EvaluationResult {
    const results = this.evaluate(text);
    const overallScore = this.calculateOverallScore(results);
    const passesThresholds = this.checkThresholds(results);

    return {
      ...results[0],
      overallScore,
      passesThresholds
    };
  }

  private evaluate(text: string): EvaluationResult[] {
    return this.standards.map(standard => {
      const score = this.evaluateStandard(text, standard);
      const feedback = this.generateFeedback(score, standard);

      return {
        standardId: standard.id,
        standardName: standard.name,
        score,
        feedback,
        details: this.generateDetails(text, standard)
      };
    });
  }

  private evaluateStandard(text: string, standard: ThinkingStandard): number {
    const matches = standard.indicators.filter((indicator: string) => 
      text.toLowerCase().includes(indicator.toLowerCase())
    );

    const score = (matches.length / standard.indicators.length) * 10;
    return Math.min(Math.max(score, 0), 10);
  }

  private generateFeedback(score: number, standard: ThinkingStandard): string {
    if (score >= 8) {
      return `Excellent application of ${standard.name.toLowerCase()}`;
    } else if (score >= 6) {
      return `Good use of ${standard.name.toLowerCase()}, but room for improvement`;
    } else if (score >= 4) {
      return `Moderate application of ${standard.name.toLowerCase()}. Consider strengthening this aspect`;
    } else {
      return `Limited evidence of ${standard.name.toLowerCase()}. Focus on incorporating this element more`;
    }
  }

  private generateDetails(text: string, standard: ThinkingStandard): string[] {
    return standard.indicators
      .filter((indicator: string) => text.toLowerCase().includes(indicator.toLowerCase()))
      .map((indicator: string) => `Found evidence of "${indicator}"`);
  }

  private calculateOverallScore(results: EvaluationResult[]): number {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  }

  private checkThresholds(results: EvaluationResult[]): boolean {
    return results.every((result, index) => 
      result.score >= this.standards[index].threshold
    );
  }
} 