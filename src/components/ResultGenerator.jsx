import React, { useState } from 'react';

/**
 * @file ResultGenerator.jsx
 * @description The final step component that displays the generated prompt.
 * Features copy-to-clipboard functionality and options to save the prompt as a template
 * or restart the process.
 * 
 * @module Components/ResultGenerator
 * @author Feng
 * @date 2026-02-04
 */

/**
 * ResultGenerator Component.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.prompt - The generated prompt string to display.
 * @param {Function} props.onSave - Callback to save the current prompt to templates.
 * @param {Function} props.onRestart - Callback to reset the application state and start over.
 * 
 * @returns {JSX.Element} The rendered ResultGenerator component.
 */
const ResultGenerator = ({ prompt, onSave, onRestart }) => {
    /**
     * @state {boolean} copied - Temporary state to show "Copied!" feedback.
     */
    const [copied, setCopied] = useState(false);

    /**
     * Handles copying the prompt text to the system clipboard.
     * Sets a temporary success state for visual feedback.
     */
    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        // Reset feedback after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pop-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header with Title and Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#6C5CE7' }}>
                    生成的提示词 ✨
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onRestart}
                        style={{
                            background: 'white',
                            color: '#636E72',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}
                    >
                        重来 🔄
                    </button>
                    <button
                        onClick={onSave}
                        style={{
                            background: '#0984e3',
                            color: 'white',
                            padding: '8px 20px',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 5px 15px rgba(9, 132, 227, 0.3)'
                        }}
                    >
                        保存 📥
                    </button>
                </div>
            </div>

            {/* Main Result Display Area */}
            <div style={{
                flex: 1,
                position: 'relative',
                background: 'white',
                borderRadius: '30px',
                borderBottomLeftRadius: '5px', /* Message Bubble Tail illusion */
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                padding: '40px',
                overflow: 'hidden'
            }}>
                <textarea
                    readOnly
                    value={prompt}
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: '#2D3436',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.05rem',
                        lineHeight: '1.6',
                        resize: 'none',
                        outline: 'none',
                        paddingBottom: '50px'
                    }}
                />

                {/* Floating Copy Button */}
                <button
                    onClick={handleCopy}
                    className="btn-bubble"
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        padding: '10px 30px',
                        fontSize: '0.9rem',
                        background: copied ? '#00b894' : 'linear-gradient(135deg, #6C5CE7, #a29bfe)',
                        color: 'white'
                    }}
                >
                    {copied ? '已复制！👌' : '复制内容 📋'}
                </button>
            </div>
        </div>
    );
};

export default ResultGenerator;
