import React, { useState } from 'react';

/**
 * @file TaskInput.jsx
 * @description The initial landing component where the user enters their raw objective or task.
 * Features a large "hero" style input field and quick-start tag buttons.
 * 
 * @module Components/TaskInput
 * @author Feng
 * @date 2026-02-04
 */

/**
 * TaskInput Component.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.onStart - Callback function triggered when the user submits a task.
 * format: (inputString) => void
 * 
 * @returns {JSX.Element} The rendered TaskInput component.
 */
const TaskInput = ({ onStart }) => {
    // =========================================================================================
    // Local State
    // =========================================================================================

    /**
     * @state {string} input - Holds the current value of the main text input field.
     */
    const [input, setInput] = useState('');

    /**
     * Handles the form submission event.
     * Prevents default browser refresh and triggers the onStart callback if input is valid.
     * 
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate input is not just whitespace
        if (input.trim()) {
            onStart(input);
        }
    };

    // Predefined quick tags for common user tasks
    const quickTags = ['周报润色', '代码解释', '活动策划', '小红书文案', '邮件回复'];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px', width: '100%' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center', position: 'relative', marginBottom: '50px' }}>
                <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#2d3436' }}>
                    今天想 <span className="text-gradient">创造</span> 什么？
                </h2>
                <p style={{ color: '#636e72', marginTop: '12px', fontSize: '1.2rem', fontWeight: 500 }}>
                    输入你的想法，让灵感自然发生
                </p>
            </div>

            {/* Main Input Area */}
            <form onSubmit={handleSubmit} className="input-hero-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="例如：帮我写一封委婉的拒绝邮件..."
                    className="input-hero"
                    autoFocus
                />
                <button
                    type="submit"
                    className="btn-hero-action"
                >
                    <span>吹泡泡</span>
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                </button>
            </form>

            {/* Quick Tags Selection */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                {quickTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setInput(tag)}
                        className="tag-chip"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TaskInput;
