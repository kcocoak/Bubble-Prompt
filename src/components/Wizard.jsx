import React, { useState } from 'react';

/**
 * @file Wizard.jsx
 * @description A step-by-step wizard component that guides the user through questions
 * to collect detailed requirements for the prompt generation.
 * 
 * @module Components/Wizard
 * @author Feng
 * @date 2026-02-04
 */

/**
 * Wizard Component.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.questions - List of question objects to display.
 * @param {Function} props.onComplete - Callback function when all questions are answered/skipped.
 * format: (answersMap) => void
 * 
 * @returns {JSX.Element} The rendered Wizard component.
 */
const Wizard = ({ questions, onComplete }) => {
  // =========================================================================================
  // State
  // =========================================================================================

  /** 
   * @state {number} currentIndex - Index of the currently displayed question. 
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /** 
   * @state {Object} answers - Accumulator for user's answers. 
   */
  const [answers, setAnswers] = useState({});

  /** 
   * @state {string} currentAnswer - The current value in the text area. 
   */
  const [currentAnswer, setCurrentAnswer] = useState('');

  const currentQuestion = questions[currentIndex];

  // Calculate progress percentage for visual indicator
  const progress = ((currentIndex + 1) / questions.length) * 100;

  /**
   * Handles navigation to the next question.
   * Saves the current answer (unless skipped) and advances the index.
   * If it's the last question, triggers onComplete.
   * 
   * @param {boolean} skip - Whether the user chose to skip the current question.
   */
  const handleNext = (skip = false) => {
    const newAnswers = { ...answers };
    if (!skip && currentAnswer.trim()) {
      newAnswers[currentQuestion.id] = currentAnswer;
    }

    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>

      {/* Question Card */}
      <div className="pop-in" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.8rem', color: '#2D3436', marginBottom: '10px' }}>
          {currentQuestion.text}
        </h3>
        <p style={{ color: '#636E72', fontSize: '1.1rem' }}>
          {currentQuestion.subText}
        </p>
      </div>

      {/* Answer Input Area */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="请输入回答..."
          className="input-bubble"
          style={{
            width: '100%',
            height: '200px',
            resize: 'none',
            borderRadius: '30px',
            marginBottom: '20px',
            boxSizing: 'border-box',
            padding: '15px',
            fontFamily: 'inherit',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}
          autoFocus
        />
      </div>

      {/* Footer Navigation and Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        {/* Progress Bubbles Indicator */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: i <= currentIndex ? '#6C5CE7' : '#dfe6e9',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => handleNext(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: 'none',
              background: 'transparent',
              color: '#b2bec3',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            跳过
          </button>
          <button
            onClick={() => handleNext(false)}
            className="btn-bubble"
            style={{ padding: '10px 30px', fontSize: '1rem' }}
          >
            {currentIndex === questions.length - 1 ? '完成 ✨' : '下一步 ->'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
