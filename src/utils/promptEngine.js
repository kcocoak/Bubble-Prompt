/**
 * @file promptEngine.js
 * @description The core engine for constructing structured prompts using the CO-STAR framework.
 * CO-STAR stands for Context, Objective, Style, Tone, Audience, Response.
 * This module provides a fluent Builder pattern interface for generating high-quality LLM prompts.
 * 
 * @module Utils/PromptEngine
 * @author Feng
 * @version 4.0.0 (Bubble Prompt Edition)
 * @date 2026-02-04
 */

/**
 * A Builder class for constructing CO-STAR structured prompts.
 * Allows chainable configuration of prompt parameters.
 * 
 * @class
 */
export class CoStarBuilder {
    /**
     * Initializes a new instance of the CoStarBuilder.
     */
    constructor() {
        /** @property {string} context - The background context or role definition. */
        this.context = "";
        /** @property {string} objective - The main goal or task description. */
        this.objective = "";
        /** @property {Array<string>} style - List of style descriptors. */
        this.style = [];
        /** @property {string} tone - The desired emotional tone of the response. */
        this.tone = "";
        /** @property {string} audience - The target audience for the content. */
        this.audience = "";
        /** @property {string} responseFormat - The required output format structure. */
        this.responseFormat = "";
        /** @property {Array<string>} constraints - List of restrictions or requirements. */
        this.constraints = [];
        /** @property {Object} userInputs - Dictionary of additional user-provided details. */
        this.userInputs = {};
    }

    /**
     * Sets the main objective of the prompt.
     * @param {string} task - The task description.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    setObjective(task) {
        this.objective = task;
        return this;
    }

    /**
     * Sets the context and role definition.
     * @param {string} industry - The domain or industry (e.g., 'Finance', 'Tech').
     * @param {string} [customContext=""] - Optional additional context.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    setContext(industry, customContext = "") {
        this.context = `你是一位 ${industry || "通用"} 领域的专家。 ${customContext}`;
        return this;
    }

    /**
     * Adds a style descriptor to the prompt.
     * @param {string} styleTag - The style keyword to add.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    addStyle(styleTag) {
        this.style.push(styleTag);
        return this;
    }

    /**
     * Sets the target audience.
     * @param {string} audience - Description of the target audience.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    setAudience(audience) {
        this.audience = audience;
        return this;
    }

    /**
     * Adds a constraint or rule to the prompt.
     * @param {string} constraint - The rule string.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    addConstraint(constraint) {
        this.constraints.push(constraint);
        return this;
    }

    /**
     * Defines the desired output format.
     * @param {string} format - Description of the format.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    setResponseFormat(format) {
        this.responseFormat = format;
        return this;
    }

    /**
     * Populates user input details from the wizard.
     * @param {Object} inputs - Key-value pair of user inputs.
     * @returns {CoStarBuilder} The builder instance for chaining.
     */
    setUserInputs(inputs) {
        this.userInputs = inputs;
        return this;
    }

    /**
     * Constructs the final prompt string based on all configured parameters.
     * 
     * @returns {string} The fully assembled prompt string.
     */
    build() {
        const styleStr = this.style.join("、");
        const inputsStr = Object.entries(this.userInputs)
            .map(([key, val]) => {
                // Simple heuristic to format key nicely if it's an ID
                const label = key.startsWith('q_') ? key.substring(2).toUpperCase() : key;
                return `- **${label}**: ${val}`;
            })
            .join("\n");

        return `
# 🚀 角色设定 (SYSTEM ROLE)
${this.context}

# 🎯 核心任务 (CO-STAR)
**背景 (Context)**: 服务于 ${this.context.split(' ')[1] || '目标'} 行业。
**目标 (Objective)**: ${this.objective}
**风格 (Style)**: ${styleStr || "专业、清晰"}
**受众 (Audience)**: ${this.audience || "普通用户"}
**格式 (Response)**: ${this.responseFormat || "结构化 Markdown"}

# 📝 用户输入信息
${inputsStr}

# ⛓️ 思考链路 (Chain of Thought)
1. 分析用户的核心目标和受众群体。
2. 识别关键限制条件和风格要求。
3. 构思内容结构，确保逻辑清晰、重点突出。
4. 调整语气以匹配用户要求的风格：${styleStr}。
5. 按照指定格式输出最终结果。

# ⛔ 限制条件与质量控制
${this.constraints.map(c => `- ${c}`).join('\n') || '- 无特殊限制。'}
- 严禁捏造事实 (No Hallucination)。
- 确保输出内容可直接用于生产环境。
- 保持 ${this.style[0] || '专业'} 的语调。

# 👇 请在下方生成回复
`.trim();
    }
}

/**
 * Factory object containing preset configurations for common task types.
 * Helps quickly configure the CoStarBuilder with best-practice constraints.
 */
export const PromptPresets = {
    /**
     * Configures the builder for marketing copy tasks.
     * Adds persuasion-related constraints.
     * @param {CoStarBuilder} builder 
     */
    marketing: (builder) => {
        builder.addConstraint("使用具有说服力的心理学技巧 (如 FOMO, 社会认同)。");
        builder.addConstraint("强调产品/服务带来的利益，而非仅仅列举功能。");
        builder.setResponseFormat("文案格式 (标题 + 正文 + 行动号召)");
    },

    /**
     * Configures the builder for coding tasks.
     * Enforces clean code and commenting standards.
     * @param {CoStarBuilder} builder 
     */
    coding: (builder) => {
        builder.addConstraint("遵循 Clean Code 代码规范。");
        builder.addConstraint("为复杂的逻辑逻辑添加中文注释。");
        builder.setResponseFormat("代码块 + Markdown 解释");
    },

    /**
     * Configures the builder for academic writing tasks.
     * Enforces formal tone and citation rules.
     * @param {CoStarBuilder} builder 
     */
    academic: (builder) => {
        builder.addConstraint("使用严谨的学术语言。");
        builder.addConstraint("如有引用，请注明来源。");
        builder.setResponseFormat("学术论文结构 (摘要, 引言, 主体, 结论)");
    }
};
