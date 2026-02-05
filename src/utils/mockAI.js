/**
 * @file mockAI.js
 * @description Provides simulated AI analysis capabilities for the application.
 * Uses keyword matching heuristics to determine task types and suggest relevant questions.
 * This acts as a lightweight local inference engine to reduce API dependency for simple classification.
 * 
 * @module Utils/MockAI
 * @author Feng
 * @date 2026-02-04
 */

/**
 * Analyzes the user's initial input to classify the task and generate follow-up questions.
 * 
 * @param {string} input - The raw text input from the user.
 * @returns {Object} An analysis result object containing:
 * - type: {string} The detected task category (e.g., 'Coding', 'MarketingCopy', 'General').
 * - recommendedQuestions: {Array<Object>} A list of question objects {id, text, subText} tailored to the task.
 */
export const analyzeTask = (input) => {
    // Normalize input for case-insensitive matching
    const lowerInput = input.toLowerCase();

    // =========================================================================================
    // Heuristic: Coding Tasks
    // =========================================================================================
    if (lowerInput.includes('代码') || lowerInput.includes('code') || lowerInput.includes('脚本') || lowerInput.includes('python')) {
        return {
            type: 'Coding',
            recommendedQuestions: [
                { id: 'q_lang', text: '什么语言？', subText: '例如: Python, JavaScript, C++' },
                { id: 'q_func', text: '具体功能？', subText: '例如: 数据清洗, 网页爬虫, 排序算法' },
                { id: 'q_lib', text: '涉及的库或框架？', subText: '例如: React, Pandas, Tailwind' }
            ]
        };
    }

    // =========================================================================================
    // Heuristic: Marketing & Copywriting
    // =========================================================================================
    if (lowerInput.includes('文案') || lowerInput.includes('copy') || lowerInput.includes('宣传') || lowerInput.includes('小红书')) {
        return {
            type: 'MarketingCopy',
            recommendedQuestions: [
                { id: 'q_platform', text: '发布平台？', subText: '例如: 小红书, 朋友圈, 抖音' },
                { id: 'q_audience', text: '目标受众？', subText: '例如: 大学生, 宝妈, 职场新人' },
                { id: 'q_goal', text: '核心目的？', subText: '例如: 增加点击, 促进下单, 品牌曝光' }
            ]
        };
    }

    // =========================================================================================
    // Fallback: General Tasks
    // =========================================================================================
    return {
        type: 'General',
        recommendedQuestions: [
            { id: 'q_detail', text: '具体细节？', subText: '补充更多关于任务的背景信息' },
            { id: 'q_audience', text: '写给谁看？', subText: '目标读者或受众是谁' },
            { id: 'q_format', text: '输出格式？', subText: '例如: 列表, 表格, 纯文本' }
        ]
    };
};
