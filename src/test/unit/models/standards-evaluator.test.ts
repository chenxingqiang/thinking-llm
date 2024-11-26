/// <reference types="vitest/globals" />
import { StandardsEvaluator } from '../../../core/evaluators/standards-evaluator';

describe('StandardsEvaluator', () => {
  let evaluator: StandardsEvaluator;

  beforeEach(() => {
    evaluator = new StandardsEvaluator();
  });

  it('should create an instance', () => {
    expect(evaluator).toBeDefined();
  });

  it('should evaluate empty content', () => {
    const result = evaluator.evaluateThinkingProcess('');
    expect(result.overallScore).toBe(0);
  });

  it('should evaluate simple content', () => {
    const simpleContent = 'Hmm... let me think about this.';
    const result = evaluator.evaluateThinkingProcess(simpleContent);
    expect(result.overallScore).toBeGreaterThan(0);
  });
}); 