interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export class ProtocolValidator {
  static async validate(content: string): Promise<ValidationResult> {
    // 这里实现具体的验证逻辑
    const errors: string[] = [];
    const warnings: string[] = [];

    // 示例验证规则
    if (!content.trim()) {
      errors.push('Content cannot be empty');
    }

    if (content.length < 100) {
      warnings.push('Content might be too short');
    }

    return { errors, warnings };
  }
} 