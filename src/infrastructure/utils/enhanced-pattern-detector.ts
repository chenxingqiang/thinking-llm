import { 
  ThinkingPattern, 
  PatternType, 
  PatternMatch,
  PatternAnalysis,
  PatternProgressionType 
} from '../types/pattern-types';

export class EnhancedPatternDetector {
  private nlpPatterns = {
    sentence_starters: {
      hypothesis: ['I think', 'Perhaps', 'Maybe', 'Possibly', 'It seems'],
      analysis: ['Looking at', 'Analyzing', 'Examining', 'Investigating'],
      reflection: ['On reflection', 'Thinking about', 'Considering'],
      conclusion: ['Therefore', 'Thus', 'Consequently', 'In conclusion'],
      weight: 1.2
    },

    connecting_phrases: {
      causal: ['because', 'since', 'as a result', 'consequently'],
      contrast: ['however', 'although', 'despite', 'on the other hand'],
      addition: ['moreover', 'furthermore', 'additionally', 'in addition'],
      sequence: ['first', 'second', 'next', 'finally'],
      weight: 1.1
    },

    cognitive_markers: {
      uncertainty: ['might', 'could', 'may', 'possibly'],
      certainty: ['definitely', 'certainly', 'clearly', 'obviously'],
      evaluation: ['better', 'worse', 'more', 'less', 'best', 'worst'],
      metacognition: ['realize', 'notice', 'aware', 'understand'],
      weight: 1.3
    }
  };

  private semanticRelations = new Map([
    ['if', ['then', 'would', 'could', 'might']],
    ['because', ['therefore', 'thus', 'consequently']],
    ['not only', ['but also', 'additionally', 'furthermore']],
    ['while', ['however', 'nevertheless', 'yet']],
    ['first', ['second', 'third', 'finally', 'lastly']]
  ]);

  analyze(text: string): PatternAnalysis {
    const sentences = this.preprocessText(text);
    const basicPatterns = this.detectBasicPatterns(sentences);
    const enhancedPatterns = this.enhancePatternDetection(basicPatterns);
    const coherenceScore = this.analyzeCoherence(enhancedPatterns);
    const progression = this.analyzeProgression(enhancedPatterns);

    return {
      patterns: enhancedPatterns,
      dominantPatterns: this.identifyDominantPatterns(enhancedPatterns),
      patternDiversity: this.calculateDiversity(enhancedPatterns),
      patternCoherence: coherenceScore,
      patternProgression: progression
    };
  }

  private preprocessText(text: string): string[] {
    return text.split(/(?<=[.!?])\s+/).map(s => s.trim());
  }

  private detectBasicPatterns(sentences: string[]): ThinkingPattern[] {
    const patterns: ThinkingPattern[] = [];
    
    Object.entries(this.nlpPatterns.sentence_starters).forEach(([type, starters]) => {
      if (type === 'weight') return;
      
      const matches = sentences.flatMap((sentence, index) => {
        const foundStarters = (starters as string[]).filter(starter => 
          sentence.toLowerCase().includes(starter.toLowerCase())
        );
        
        return foundStarters.map(match => ({
          text: match,
          position: index,
          context: sentence,
          strength: this.calculateMatchStrength(match, sentence)
        }));
      });

      if (matches.length > 0) {
        patterns.push({
          type: this.mapToPatternType(type),
          matches,
          frequency: matches.length,
          significance: this.calculateSignificance(matches)
        });
      }
    });

    return patterns;
  }

  private mapToPatternType(type: string): PatternType {
    const typeMap: Record<string, PatternType> = {
      hypothesis: 'hypothesis_formation',
      analysis: 'comparative_analysis',
      reflection: 'metacognition',
      conclusion: 'solution_synthesis'
    };

    return typeMap[type] || 'metacognition';
  }

  private calculateMatchStrength(match: string, context: string): number {
    const baseStrength = 0.5;
    const contextBonus = this.hasStrongContext(context) ? 0.3 : 0;
    const lengthBonus = Math.min(match.length / 50, 0.2);
    
    return Math.min(baseStrength + contextBonus + lengthBonus, 1);
  }

  private hasStrongContext(context: string): boolean {
    return this.semanticRelations.has(context.toLowerCase());
  }

  private calculateSignificance(matches: PatternMatch[]): number {
    return Math.min(
      matches.reduce((sum, match) => sum + match.strength, 0) * 2,
      10
    );
  }

  private enhancePatternDetection(
    patterns: ThinkingPattern[]
  ): ThinkingPattern[] {
    return patterns.map(pattern => ({
      ...pattern,
      significance: this.calculateEnhancedSignificance(pattern),
      matches: pattern.matches
    }));
  }

  private calculateEnhancedSignificance(pattern: ThinkingPattern): number {
    const baseSignificance = pattern.significance;
    const contextualBoost = 0.2;
    const coherenceBoost = 0.1;

    return Math.min(baseSignificance * (1 + contextualBoost + coherenceBoost), 10);
  }

  private identifyDominantPatterns(patterns: ThinkingPattern[]): PatternType[] {
    return patterns
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3)
      .map(p => p.type);
  }

  private calculateDiversity(patterns: ThinkingPattern[]): number {
    const uniquePatterns = new Set(patterns.map(p => p.type));
    return (uniquePatterns.size / 10) * 10;
  }

  private analyzeCoherence(patterns: ThinkingPattern[]): number {
    return Math.min(
      patterns.reduce((sum, p) => sum + p.significance, 0) / patterns.length,
      10
    );
  }

  private hasIterativePatterns(patterns: ThinkingPattern[]): boolean {
    return patterns.some((p, i) => i > 0 && p.type === patterns[i-1].type);
  }

  private analyzeProgression(patterns: ThinkingPattern[]): PatternProgressionType[] {
    const progressionTypes: PatternProgressionType[] = ['linear'];
    
    if (this.hasIterativePatterns(patterns)) {
      progressionTypes.push('iterative');
    }

    return progressionTypes;
  }
} 