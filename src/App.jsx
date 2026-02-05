import React, { useState, useEffect } from 'react';
/* Import Styles */
import './theme.css';

/* Import Components */
import TaskInput from './components/TaskInput';
import Wizard from './components/Wizard';
import TagSelector from './components/TagSelector';
import ResultGenerator from './components/ResultGenerator';
import TemplateSidebar from './components/TemplateSidebar';

/* Import Engine */
import { CoStarBuilder, PromptPresets } from './utils/promptEngine';
import { analyzeTask } from './utils/mockAI';
/* Import Weather */
import { getWeather, getWeatherTheme } from './utils/weatherService';

/**
 * @file App.jsx
 * @description Main application entry point for the Bubble Prompt (泡泡提示器) application.
 * This component manages the global state, routing between different wizard steps,
 * handles the integration with the prompt generation engine, and manages the
 * "Bubble Box" (template storage) functionality.
 * 
 * @module Application
 * @author Feng
 * @version 1.0.0
 * @date 2026-02-04
 * @copyright (c) 2026 Feng. All rights reserved.
 */

/**
 * Main Application Component.
 * 
 * @component
 * @returns {JSX.Element} The rendered application component.
 */
const App = () => {
  // =========================================================================================
  // Global State Management
  // =========================================================================================

  /** 
   * @state {string} step - Controls the current view/stage of the application wizard.
   * Possible values: 'input', 'wizard', 'tagging', 'result'.
   */
  const [step, setStep] = useState('input');

  /** 
   * @state {string} taskInput - Stores the initial user input (task description). 
   */
  const [taskInput, setTaskInput] = useState('');

  /** 
   * @state {string} taskType - The category of task identified by the system (e.g., 'Writing', 'Coding'). 
   */
  const [taskType, setTaskType] = useState('General');

  /** 
   * @state {Array<Object>} questions - List of questions generated for the current task to guide the user. 
   */
  const [questions, setQuestions] = useState([]);

  /** 
   * @state {Object} answers - Dictionary storing user's answers to the wizard questions. 
   */
  const [answers, setAnswers] = useState({});

  /** 
   * @state {string} generatedPrompt - The final generated prompt output. 
   */
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // =========================================================================================
  // Tag Selection State
  // =========================================================================================

  /** 
   * @state {Array<string>} selectedStyles - List of selected style tags (e.g., 'Professional', 'Humorous'). 
   */
  const [selectedStyles, setSelectedStyles] = useState(['直接']);

  /** 
   * @state {Array<string>} selectedIndustries - List of selected industry tags. 
   */
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  // =========================================================================================
  // Sidebar (Templates) State
  // =========================================================================================

  /** 
   * @state {Array<Object>} templates - List of saved prompt templates loaded from local storage. 
   */
  const [templates, setTemplates] = useState([]);

  /** 
   * @state {boolean} isSidebarOpen - Boolean flag to toggle the visibility of the template sidebar. 
   */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // =========================================================================================
  // 🛁 Bubble Visual Engine
  // =========================================================================================

  /** 
   * @state {Array<Object>} bubbles - Array of active bubble objects for the background animation. 
   */
  const [bubbles, setBubbles] = useState([]);

  // =========================================================================================
  // 🌤️ Weather Theme System
  // =========================================================================================

  /** 
   * @state {Object} weatherTheme - Current UI theme object derived from weather conditions. 
   */
  const [weatherTheme, setWeatherTheme] = useState(getWeatherTheme(undefined)); // Default

  /** 
   * @state {Object|null} weatherData - Raw weather data fetched from the service. 
   */
  const [weatherData, setWeatherData] = useState(null);

  /**
   * Effect Hook: Fetch Weather Data on Component Mount.
   * Asynchronously retrieves current weather information to adapt the application theme.
   */
  useEffect(() => {
    getWeather().then(current => {
      console.log('Weather fetched:', current);
      setWeatherData(current);
      const theme = getWeatherTheme(current.weathercode);
      setWeatherTheme(theme);
    }).catch(err => {
      console.warn('Weather fetch failed, using default:', err);
    });
  }, []);

  /**
   * Effect Hook: Bubble Spawner System.
   * Manages the continuous generation of background bubbles for visual effect.
   * Bubbles are automatically cleaned up after their animation duration to prevent memory leaks.
   */
  useEffect(() => {
    const spawnBubble = () => {
      const id = Date.now();
      const size = Math.random() * 60 + 20; // Random size between 20px and 80px
      const left = Math.random() * 100; // Random horizontal position 0% - 100%
      const duration = Math.random() * 10 + 5; // Random float duration 5s - 15s
      const delay = Math.random() * 2;

      const newBubble = { id, size, left, duration, delay, popping: false };

      setBubbles(prev => [...prev, newBubble]);

      // Cleanup bubble after animation (approx) to prevent memory leak
      // Buffer of 1000ms added to ensure animation completes
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== id));
      }, (duration + delay) * 1000 + 1000);
    };

    const interval = setInterval(spawnBubble, 800); // New bubble spawned every 800ms
    return () => clearInterval(interval);
  }, []);

  /**
   * Handles the "popping" interaction of a bubble.
   * Triggers the pop animation and then removes the bubble from state.
   * 
   * @param {number} id - The unique identifier of the bubble to pop.
   */
  const popBubble = (id) => {
    // Mark as popping to trigger CSS animation
    setBubbles(prev => prev.map(b =>
      b.id === id ? { ...b, popping: true } : b
    ));

    // Remove after pop animation (300ms) matches CSS transition
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
    }, 300);
  };

  /**
   * Effect Hook: Load Templates.
   * Retrieves saved prompt templates from Local Storage on application start.
   */
  useEffect(() => {
    const saved = localStorage.getItem('bubble_templates');
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  // =========================================================================================
  // Event Handlers
  // =========================================================================================

  /**
   * Updates state when the user starts the prompt creation process.
   * Analyzes the initial input to determine task type and recommended questions.
   * 
   * @param {string} input - The raw user input string.
   */
  const handleStart = (input) => {
    const analysis = analyzeTask(input);
    setTaskInput(input);
    setTaskType(analysis.type);
    setQuestions(analysis.recommendedQuestions);
    setStep('wizard');
  };

  /**
   * Handles the completion of the Wizard step.
   * Collects all answers and advances to the tagging step.
   * 
   * @param {Object} collectedAnswers - The key-value set of collected user answers.
   */
  const handleWizardComplete = (collectedAnswers) => {
    setAnswers(collectedAnswers);
    setStep('tagging');
  };

  /**
   * Generates the final prompt based on all collected data.
   * Uses the CoStarBuilder engine to construct the structured prompt.
   */
  const handleGenerate = () => {
    const builder = new CoStarBuilder();
    builder.setObjective(taskInput);
    builder.setContext(selectedIndustries[0] || '通用');
    builder.setUserInputs(answers);

    selectedStyles.forEach(s => builder.addStyle(s));

    // Apply Presets based on identified task type
    if (taskType === 'Coding') PromptPresets.coding(builder);
    if (taskType === 'MarketingCopy') PromptPresets.marketing(builder);

    if (!builder.responseFormat) builder.setResponseFormat("Markdown 结构化格式");

    const prompt = builder.build();
    setGeneratedPrompt(prompt);
    setStep('result');
  };

  /**
   * Saves the currently generated prompt as a template.
   * Prompts the user for a name and persists the template to Local Storage.
   */
  const handleSaveTemplate = () => {
    const name = prompt('给这个泡泡起个名字 🫧', taskInput.substring(0, 10));
    if (!name) return;

    const newTpl = {
      id: Date.now(),
      name,
      date: new Date().toISOString(),
      taskInput,
      taskType,
      answers,
      selectedStyles,
      selectedIndustries,
      generatedPrompt,
      tags: [...selectedStyles, ...selectedIndustries]
    };

    const newTemplates = [newTpl, ...templates];
    setTemplates(newTemplates);
    localStorage.setItem('bubble_templates', JSON.stringify(newTemplates));
    setIsSidebarOpen(true);
  };

  /**
   * Deletes a saved template by ID.
   * Updates local state and Local Storage.
   * 
   * @param {number} id - The ID of the template to delete.
   */
  const handleDeleteTemplate = (id) => {
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    localStorage.setItem('bubble_templates', JSON.stringify(newTemplates));
  };

  /**
   * Loads a saved template into the active workspace.
   * Restores all relevant state variables (input, answers, styles, etc.).
   * 
   * @param {Object} tpl - The template object to load.
   */
  const handleLoadTemplate = (tpl) => {
    setTaskInput(tpl.taskInput);
    setAnswers(tpl.answers);
    setSelectedStyles(tpl.selectedStyles);
    setSelectedIndustries(tpl.selectedIndustries);
    setGeneratedPrompt(tpl.generatedPrompt);
    setStep('result');
    setIsSidebarOpen(false);
  };

  // Predefined options for tags
  const styleOptions = ['专业严谨', '幽默风趣', '温暖治愈', '简洁明了', '极客硬核', '逻辑缜密'];
  const industryOptions = ['互联网', '教育', '金融', '电商', '医疗', '法律', '创意写作'];

  return (
    <div className="kawaii-container">
      {/* Background Layer with Weather Theme */}
      <div
        className="bubble-bg"
        style={{
          background: weatherTheme.bg,
          backgroundSize: '200% 200%',
          transition: 'background 1s ease'
        }}
      >
        {/* Render Floating Bubbles */}
        {bubbles.map(b => (
          <div
            key={b.id}
            className={`magic-bubble ${b.popping ? 'pop-animation' : ''}`}
            onMouseDown={() => popBubble(b.id)} // MouseDown makes it feel more responsive than Click
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`
            }}
          />
        ))}
      </div>

      {/* Application Header */}
      <div className="app-header">
        <div className="logo-container" onClick={() => setStep('input')}>
          <div className="logo-icon">
            🫧
          </div>
          <h1 className="logo-text">
            Bubble <span className="text-gradient">Prompt</span>
          </h1>
          {/* Weather Indicator Pill */}
          {weatherData && (
            <span style={{
              marginLeft: '15px',
              fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.6)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontWeight: '600',
              color: '#636e72'
            }}>
              {weatherTheme.name} {weatherData.temperature}°C
            </span>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="btn-ghost"
        >
          ☁️ 泡泡盒子 ({templates.length})
        </button>
      </div>

      {/* Main Content Area (Glassmorphism Card) */}
      <div className="bubble-card pop-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Step 1: Initial Input */}
        {step === 'input' && (
          <TaskInput onStart={handleStart} />
        )}

        {/* Step 2: Questionnaire Wizard */}
        {step === 'wizard' && (
          <Wizard questions={questions} onComplete={handleWizardComplete} />
        )}

        {/* Step 3: Tag Selection */}
        {step === 'tagging' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '30px', color: '#636E72' }}>选择你的 <span className="text-gradient">风格泡泡</span></h2>
            <TagSelector
              type="style"
              options={styleOptions}
              selected={selectedStyles}
              onToggle={(t) => setSelectedStyles(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
            />
            <div style={{ margin: '30px 0' }} />
            <h2 style={{ marginBottom: '30px', color: '#636E72' }}>选择 <span className="text-gradient">行业领域</span></h2>
            <TagSelector
              type="industry"
              options={industryOptions}
              selected={selectedIndustries}
              onToggle={(t) => setSelectedIndustries(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
            />

            <div style={{ marginTop: '50px' }}>
              <button
                onClick={handleGenerate}
                className="btn-bubble"
              >
                生成提示词 ✨
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result Generation */}
        {step === 'result' && (
          <ResultGenerator
            prompt={generatedPrompt}
            onSave={handleSaveTemplate}
            onRestart={() => setStep('input')}
          />
        )}

      </div>

      {/* Template Sidebar Component */}
      <TemplateSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        templates={templates}
        onLoad={handleLoadTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};

export default App;
