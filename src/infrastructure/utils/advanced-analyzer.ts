import { AdvancedMetrics, CognitivePattern, ThinkingFlow, SentimentAnalysis } from '../types/analysis-types';

export class AdvancedAnalyzer {
  private patterns = {
    analytical: ['analyze', 'compare', 'examine', 'investigate', 'evaluate'],
    creative: ['imagine', 'create', 'innovate', 'envision', 'design'],
    critical: ['challenge', 'question', 'dispute', 'critique', 'assess'],
    practical: ['implement', 'apply', 'execute', 'perform', 'utilize'],
    reflective: ['reflect', 'consider', 'ponder', 'contemplate', 'review']
  };

  private sentimentIndicators = {
    uncertain: ['maybe', 'perhaps', 'possibly', 'might', 'could'],
    confident: ['definitely', 'certainly', 'clearly', 'indeed', 'absolutely'],
    questioning: ['why', 'how', 'what if', 'wonder', 'curious'],
    concluding: ['therefore', 'thus', 'consequently', 'hence', 'conclude']
  };

  analyze(text: string): AdvancedMetrics {
    return {
      cognitivePatterns: this.analyzeCognitivePatterns(text),
      thinkingFlow: this.analyzeThinkingFlow(text),
      sentiment: this.analyzeSentiment(text),
      coherenceScore: this.calculateCoherenceScore(),
      depthScore: this.calculateDepthScore(),
      clarityScore: this.calculateClarityScore()
    };
  }

  private analyzeCognitivePatterns(text: string): CognitivePattern[] {
    return Object.entries(this.patterns).map(([type, keywords]) => {
      const examples = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        type: type as CognitivePattern['type'],
        confidence: (examples.length / keywords.length) * 10,
        examples
      };
    });
  }

  private analyzeThinkingFlow(text: string): ThinkingFlow[] {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const flowStages: ThinkingFlow[] = [];
    
    sentences.forEach((sentence, index) => {
      const stage = this.determineThinkingStage(sentence, index / sentences.length);
      flowStages.push({
        stage,
        content: sentence.trim(),
        strength: this.calculateStageStrength(sentence)
      });
    });

    return flowStages;
  }

  private determineThinkingStage(_sentence: string, progress: number): ThinkingFlow['stage'] {
    if (progress < 0.2) return 'initial';
    if (progress < 0.4) return 'exploration';
    if (progress < 0.6) return 'analysis';
    if (progress < 0.8) return 'synthesis';
    return 'conclusion';
  }

  private calculateStageStrength(sentence: string): number {
    const words = sentence.split(/\s+/).length;
    const hasKeywords = Object.values(this.patterns)
      .flat()
      .some(keyword => sentence.toLowerCase().includes(keyword));
    
    return Math.min((words / 10) * (hasKeywords ? 1.5 : 1), 10);
  }

  private analyzeSentiment(text: string): SentimentAnalysis {
    let dominantTone: SentimentAnalysis['tone'] = 'neutral';
    let maxScore = 0;
    let keywords: string[] = [];

    Object.entries(this.sentimentIndicators).forEach(([tone, indicators]) => {
      const matches = indicators.filter(indicator => 
        text.toLowerCase().includes(indicator.toLowerCase())
      );
      
      if (matches.length > maxScore) {
        dominantTone = tone as SentimentAnalysis['tone'];
        maxScore = matches.length;
        keywords = indicators;
      }
    });

    return {
      tone: dominantTone,
      score: maxScore,
      keywords
    };
  }

  private calculateCoherenceScore(): number {
    // TODO: Implement coherence score calculation
    return 7;
  }

  private calculateDepthScore(): number {
    // TODO: Implement depth score calculation
    return 6;
  }

  private calculateClarityScore(): number {
    // TODO: Implement clarity score calculation
    return 8;
  }
} 