import { 
  ThinkingPattern, 
  PatternType, 
  PatternMatch, 
  PatternAnalysis,
  PatternContext,
  PatternProgressionType 
} from '../types/pattern-types';

export class PatternDetector {
  private patternDefinitions = {
    hypothesis_formation: {
      indicators: [
        'I hypothesize', 'might be because', 'could explain', 'possibly due to',
        'suggests that', 'if we assume', 'this implies', 'leading me to think'
      ],
      contextual: ['if', 'then', 'because', 'therefore'],
      weight: 1.2
    },
    
    causal_reasoning: {
      indicators: [
        'leads to', 'causes', 'results in', 'affects', 'influences',
        'due to', 'consequently', 'as a result', 'impact on'
      ],
      contextual: ['because', 'since', 'thus', 'hence'],
      weight: 1.1
    },
    
    comparative_analysis: {
      indicators: [
        'compared to', 'in contrast', 'similarly', 'differs from',
        'whereas', 'while', 'on the other hand', 'alternatively'
      ],
      contextual: ['more', 'less', 'better', 'worse', 'like', 'unlike'],
      weight: 1.0
    },
    
    problem_decomposition: {
      indicators: [
        'break this down', 'looking at each part', 'component by component',
        'separate concerns', 'divide into', 'analyze each aspect'
      ],
      contextual: ['first', 'second', 'finally', 'moreover'],
      weight: 1.3
    },
    
    solution_synthesis: {
      indicators: [
        'combining these ideas', 'integrating', 'synthesizing', 'putting together',
        'merging', 'unifying', 'bringing together', 'consolidating'
      ],
      contextual: ['therefore', 'thus', 'consequently'],
      weight: 1.2
    },
    
    assumption_questioning: {
      indicators: [
        'but what if', 'assuming that', 'is it really true', 'questioning whether',
        'challenging the idea', 'not necessarily', 'might not be'
      ],
      contextual: ['however', 'although', 'despite', 'yet'],
      weight: 1.4
    },
    
    evidence_evaluation: {
      indicators: [
        'evidence suggests', 'data shows', 'demonstrates', 'indicates',
        'supports', 'contradicts', 'validates', 'proves'
      ],
      contextual: ['because', 'since', 'as shown by'],
      weight: 1.1
    },
    
    alternative_exploration: {
      indicators: [
        'another possibility', 'alternatively', 'another approach',
        'different perspective', 'other options', 'different way'
      ],
      contextual: ['or', 'instead', 'rather'],
      weight: 1.2
    },
    
    metacognition: {
      indicators: [
        'thinking about my thinking', 'reflecting on', 'noticing that I',
        'becoming aware', 'realizing my approach', 'monitoring my'
      ],
      contextual: ['now', 'as I think', 'while'],
      weight: 1.5
    },
    
    analogical_thinking: {
      indicators: [
        'similar to', 'like when', 'reminds me of', 'analogous to',
        'just as', 'parallels with', 'comparable to'
      ],
      contextual: ['like', 'as', 'resembles'],
      weight: 1.3
    }
  };

  private progressionPatterns = {
    linear: (patterns: ThinkingPattern[]) => 
      patterns.every((p, i) => {
        if (i === 0) return true;
        const prevPattern = patterns[i-1];
        return p.position !== undefined && 
               prevPattern?.position !== undefined && 
               p.position > prevPattern.position;
      }),
    
    cyclical: (patterns: ThinkingPattern[]) => {
      const types = patterns.map(p => p.type);
      return new Set(types).size < types.length;
    },
    
    branching: (patterns: ThinkingPattern[]) =>
      patterns.some(p => p.type === 'alternative_exploration'),
    
    iterative: (patterns: ThinkingPattern[]) =>
      patterns.some((p, i) => i > 0 && p.type === patterns[i-1].type),
    
    convergent: (patterns: ThinkingPattern[]) =>
      patterns.slice(-3).some(p => p.type === 'solution_synthesis')
  };

  analyze(text: string): PatternAnalysis {
    const patterns = this.detectPatterns(text);
    const dominantPatterns = this.findDominantPatterns(patterns);
    const patternDiversity = this.calculatePatternDiversity(patterns);
    const patternCoherence = this.calculatePatternCoherence(patterns);
    const patternProgression = this.analyzeProgression(patterns);

    return {
      patterns,
      dominantPatterns,
      patternDiversity,
      patternCoherence,
      patternProgression
    };
  }

  private detectPatterns(text: string): ThinkingPattern[] {
    return Object.entries(this.patternDefinitions).map(([type, definition]) => {
      const matches = this.findMatches(text, definition.indicators, definition.contextual);
      
      return {
        type: type as PatternType,
        matches,
        frequency: matches.length,
        significance: matches.reduce((sum, m) => sum + m.strength, 0) * definition.weight
      };
    });
  }

  private findMatches(text: string, indicators: string[], contextual: string[]): PatternMatch[] {
    const matches: PatternMatch[] = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach((sentence, sentenceIndex) => {
      indicators.forEach(indicator => {
        const position = sentence.toLowerCase().indexOf(indicator.toLowerCase());
        if (position >= 0) {
          const context = this.getContext(sentence, position, indicator.length);
          const contextualStrength = this.calculateContextualStrength(sentence, contextual);
          
          matches.push({
            text: indicator,
            position: sentenceIndex,
            context: context.match,
            strength: this.calculateMatchStrength(context, contextualStrength)
          });
        }
      });
    });

    return matches;
  }

  private getContext(text: string, position: number, length: number): PatternContext {
    const beforeChars = 20;
    const afterChars = 20;

    return {
      before: text.slice(Math.max(0, position - beforeChars), position),
      match: text.slice(position, position + length),
      after: text.slice(position + length, position + length + afterChars)
    };
  }

  private calculateContextualStrength(text: string, contextual: string[]): number {
    const matches = contextual.filter(c => text.toLowerCase().includes(c.toLowerCase()));
    return matches.length / contextual.length;
  }

  private calculateMatchStrength(context: PatternContext, contextualStrength: number): number {
    const hasLeadingIndicator = /^[A-Z]/.test(context.match);
    const hasFollowingPunctuation = /[,.!?]$/.test(context.after);
    
    return (
      0.5 + // base strength
      (contextualStrength * 0.3) + // contextual words
      (hasLeadingIndicator ? 0.1 : 0) + // starts sentence
      (hasFollowingPunctuation ? 0.1 : 0) // proper punctuation
    );
  }

  private findDominantPatterns(patterns: ThinkingPattern[]): PatternType[] {
    return patterns
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3)
      .map(p => p.type);
  }

  private calculatePatternDiversity(patterns: ThinkingPattern[]): number {
    const uniquePatterns = new Set(patterns.filter(p => p.matches.length > 0).map(p => p.type));
    return (uniquePatterns.size / Object.keys(this.patternDefinitions).length) * 10;
  }

  private calculatePatternCoherence(patterns: ThinkingPattern[]): number {
    const transitions = patterns.slice(1).filter((p, i) => {
      const prev = patterns[i];
      return this.isCoherentTransition(prev.type, p.type);
    }).length;

    return Math.min((transitions / (patterns.length - 1)) * 10, 10);
  }

  private isCoherentTransition(from: PatternType, to: PatternType): boolean {
    const coherentPairs: Record<PatternType, PatternType[]> = {
      hypothesis_formation: ['evidence_evaluation', 'causal_reasoning'],
      causal_reasoning: ['evidence_evaluation', 'comparative_analysis'],
      comparative_analysis: ['solution_synthesis', 'alternative_exploration'],
      problem_decomposition: ['causal_reasoning', 'solution_synthesis'],
      solution_synthesis: ['evidence_evaluation', 'metacognition'],
      assumption_questioning: ['evidence_evaluation', 'alternative_exploration'],
      evidence_evaluation: ['solution_synthesis', 'assumption_questioning'],
      alternative_exploration: ['comparative_analysis', 'solution_synthesis'],
      metacognition: ['assumption_questioning', 'solution_synthesis'],
      analogical_thinking: ['comparative_analysis', 'solution_synthesis']
    };

    return coherentPairs[from]?.includes(to) ?? false;
  }

  private analyzeProgression(patterns: ThinkingPattern[]): PatternProgressionType[] {
    return Object.entries(this.progressionPatterns)
      .filter(([_, test]) => test(patterns))
      .map(([type]) => type as PatternProgressionType);
  }
} 