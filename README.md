# Thinking Protocol Project | 思维协议项目

[English](#english) | [中文](#chinese)

## English

### Overview

This project, inspired by the thinking-claude project, aims to provide a comprehensive set of thinking protocols to assist different roles (such as academic writers, programmers, software product designers, testers, and bug fixers) in their workflow. It ensures high-quality thinking and decision-making based on deep understanding rather than hasty judgments.

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Start development server
pnpm dev

# Run tests
pnpm test
```

### Project Structure

- **extension/**: Browser extension for code block management
  - **content.js**: Implements `CodeBlockCollapser` class for handling code block folding and copying
  - **manifest.json**: Browser extension manifest file
- **famous_thinking_mode/**: Contains various thinking protocols
- **src/**: Main application source code
- **supabase/**: Supabase related configurations and migrations

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Chinese

## 项目概述

本项目参考了 thinking-claude 项目的思路, 旨在提供一系列全面且深入的思维协议，以帮助不同角色（如学术写作者、程序员、软件产品设计者、测试和漏洞修复人员等）在各自的工作流程中进行高质量的思考和决策，确保行动基于深入理解而非仓促判断。

## 项目结构

- **extension/**
  - **content.js**：实现了`CodeBlockCollapser`类，用于处理网页上代码块的折叠和展开功能，同时添加了复制按钮。该类在页面加载和`DOMContentLoaded`事件时初始化，通过监听页面变化来处理新出现的代码块。
  - **manifest.json**：浏览器扩展的清单文件，指定了扩展的基本信息，如名称、版本、描述、权限和内容脚本等，用于在浏览器中正确加载扩展。
- **famous_thinking_mode/**
  - **deliberate_practice_in_thinking.md**：详细阐述了刻意练习思维的协议，包括适应性思维框架、核心思维序列、验证与质量控制、高级思维技巧等多个方面，强调思维过程的全面性、自然性和深入性。
  - **thinking_fast_and_slow_protocol.md**：提供了快慢思考协议的指导方针，涉及思考过程的各个环节，如初始参与、问题空间探索、假设生成、测试验证等，注重思维的适应性和质量控制。
- **models/**
  - **claude_model_instructions.md**：针对Claude模型的思考协议，明确了Claude在与人类交互时应遵循的思考过程，涵盖从问题理解到回答生成的各个阶段，以确保回答的合理性和高质量。
- **roles/**
  - **academic_writing_thinking_protocol.md**：为学术写作者制定的思维协议，指导在学术写作过程中的思考，包括如何分析问题、组织内容、引用证据等，以实现高质量的学术写作。
  - **program_testing_and_bug_fixing_thinking_protocol.md**：适用于程序测试和漏洞修复人员的思维协议，详细描述了在测试和修复过程中的思考流程，帮助发现和解决程序中的问题。
  - **programming_thinking_protocol.md**：程序员的思维协议，指导在编程任务中的思考，从问题理解到代码实现，注重思维的灵活性和代码质量。
  - **software_product_design_protocol.md**：软件产品设计团队的思维协议，涉及设计过程中的各个方面，如需求分析、设计决策、测试验证等，以确保设计出满足用户需求的软件产品。

## 详细功能

### 代码块处理（`extension/content.js`）

- **代码块折叠展开**：自动检测页面上的代码块，为其添加折叠和展开功能，方便用户查看代码。
- **复制按钮添加**：在代码块旁边添加复制按钮，用户点击可复制代码内容，提高代码使用的便利性。

### 思维协议（各`.md`文件）

- **通用准则**
  - **全面深入思考**：在各项任务前和过程中进行全面、自然且无过滤的思考，涵盖问题的各个方面。
  - **思维自然表达**：思考过程以自然语言呈现，避免僵化格式，如同内部对话。
  - **多维度思考**：考虑问题的复杂性，从多个维度分析，涉及多种因素和视角。
- **具体协议内容**
  - **适应性思维框架**：根据任务特点调整思考深度和风格，如依据问题复杂度、重要性、时间等因素。
  - **核心思维序列**：包括初始参与、问题空间探索、假设生成、自然发现、测试验证、错误识别纠正、知识合成、模式识别分析、进度跟踪和递归思考等环节。
  - **验证与质量控制**：通过系统验证、错误预防和质量指标评估等方式确保思维和行动的准确性和有效性。
  - **高级思维技巧**：如领域整合、战略元认知和合成技巧，提升思维和工作的质量。

## 如何使用

### 代码块处理

1. 将`extension`文件夹加载为浏览器扩展（具体操作因浏览器而异）。
2. 访问包含代码块的网页，代码块将自动具备折叠展开和复制功能。

### 思维协议

1. 根据自身角色（学术写作者、程序员、测试修复人员、软件设计者等）选择对应的思维协议文件（`.md`）。
2. 遵循协议中的指导方针，在相应任务（写作、编程、测试、设计等）过程中进行思考和决策。

## 注意事项

1. 所有思维过程必须极其全面和深入，不得遗漏重要细节。
2. 思维过程应包含在带有`thinking`标题的代码块中，且对他人隐藏（除用于反思或讨论外）。
3. 思考过程中避免使用三个反引号的代码块，仅提供原始代码片段，以免破坏思维块。
4. 明确区分思维过程（内部独白）和最终成果（外部沟通），保持两者的独立性。

## 贡献指南

1. 若发现问题或有改进建议，请在GitHub上提交issue。
2. 欢迎提交pull request，贡献新的思维协议或改进现有代码和文档。

## 开源许可

本项目遵循MIT开源许可，详情请参阅LICENSE文件。

## 联系方式

如有疑问或需要进一步沟通，请联系chengxingqiang（<chen.xingqiang@iechor.com>）。欢迎关注GitHub账号获取项目最新动态。

## License

MIT License
