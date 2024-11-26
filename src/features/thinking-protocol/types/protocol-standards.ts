export interface ThinkingStandard {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1 for weighted calculations
  threshold: number; // 0-10 minimum acceptable score
  currentValue: number; // 0-10 actual score
  indicators: string[];
}

export interface StandardCategory {
  id: string;
  name: string;
  description: string;
  weight: number;
  standards: ThinkingStandard[];
}

export interface ProtocolStandards {
  categories: StandardCategory[];
}

export const DEFAULT_STANDARDS: ProtocolStandards = {
  categories: [
    {
      id: 'natural-language',
      name: 'Natural Language',
      description: 'Evaluates natural language indicators in thinking process',
      weight: 1,
      standards: [
        {
          id: 'thinking-indicators',
          name: 'Thinking Indicators',
          description: 'Checks for presence of thinking indicator phrases',
          weight: 1,
          threshold: 5,
          currentValue: 0,
          indicators: [
            'Hmm',
            'let me think',
            'interesting',
            'I wonder',
            'This reminds me of',
            'Actually',
            'On second thought'
          ]
        }
      ]
    }
  ]
}
