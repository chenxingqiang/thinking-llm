/// <reference types="vitest/globals" />
import { StandardsEvaluator } from '../../core/evaluators/standards-evaluator';
import type { ThinkingMetrics } from '../../types/evaluation';

describe('Thinking Protocol Integration Tests', () => {
  const evaluator = new StandardsEvaluator();

  it('should evaluate basic thinking process', () => {
    const simpleContent = `
      Hmm, let me think about this problem.
      First, I need to understand what's being asked.
      This seems interesting because...
    `;

    const result: ThinkingMetrics = evaluator.evaluateThinkingProcess(simpleContent);
    expect(result).toBeDefined();
    expect(result.overallScore).toBeGreaterThan(0);
  });

  it('should detect natural language indicators', () => {
    const content = `
      Hmm... this is interesting.
      Let me think about this further.
      Actually, I see a pattern here.
    `;

    const result: ThinkingMetrics = evaluator.evaluateThinkingProcess(content);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.meetsStandards).toBe(true);
    expect(result.naturalLanguageScore).toBeGreaterThan(0.7);
  });
}); 