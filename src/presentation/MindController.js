/**
 * Presentation layer for Mind/Brain Exercises UI
 * Handles mind exercise interface and user interactions with full keyboard support
 */

import { 
  startMindSession,
  getCurrentMindSession,
  updateMindSession,
  endMindSession,
  getNextExercise,
  getCurrentExercise,
  submitAnswer,
  getSessionProgress,
  getMindStatisticsData,
  isMindSessionActive,
  resetMindSession
} from '../application/MindService.js';
import { 
  getElementById, 
  updateTextContent, 
  addClass, 
  removeClass, 
  addEventListener, 
  showElement, 
  hideElement,
  updateInnerHTML,
  focusElement,
  blurElement
} from '../infrastructure/UI.js';
import { 
  playMindExerciseStart,
  playMindCorrectAnswer,
  playMindWrongAnswer,
  playMindHint,
  playMindTimerWarning,
  playMindComplete
} from '../infrastructure/Audio.js';

/**
 * Initialize mind exercise functionality
 */
export function initializeMind() {
  renderMindInterface();
  setupMindControls();
  setupMindKeyboardShortcuts();
  setupMindModal();
}

/**
 * Render mind exercise interface
 */
export function renderMindInterface() {
  const stats = getMindStatisticsData();
  updateStatisticsDisplay(stats);
}

/**
 * Setup mind modal
 */
function setupMindModal() {
  const openBtn = getElementById('mindBtn');
  const modal = getElementById('mindModal');
  const closeBtn = getElementById('mindClose');
  const shortcutsBtn = getElementById('mindShortcutsBtn');
  const shortcutsModal = getElementById('mindShortcutsModal');
  const shortcutsCloseBtn = getElementById('mindShortcutsClose');
  
  if (openBtn) {
    addEventListener(openBtn, 'click', () => {
      showMindModal();
    });
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', () => {
      hideMindModal();
    });
  }
  
  if (shortcutsBtn) {
    addEventListener(shortcutsBtn, 'click', () => {
      showShortcutsModal();
    });
  }
  
  if (shortcutsCloseBtn) {
    addEventListener(shortcutsCloseBtn, 'click', () => {
      hideShortcutsModal();
    });
  }
}

/**
 * Setup mind control buttons
 */
function setupMindControls() {
  const startBtn = getElementById('mindStart');
  const hintBtn = getElementById('mindHint');
  const skipBtn = getElementById('mindSkip');
  const resetBtn = getElementById('mindReset');
  const answerInput = getElementById('mindAnswer');
  const submitBtn = getElementById('mindSubmit');
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleStartMind);
  }
  
  if (hintBtn) {
    addEventListener(hintBtn, 'click', handleShowHint);
  }
  
  if (skipBtn) {
    addEventListener(skipBtn, 'click', handleSkipExercise);
  }
  
  if (resetBtn) {
    addEventListener(resetBtn, 'click', handleResetMind);
  }
  
  if (submitBtn) {
    addEventListener(submitBtn, 'click', handleSubmitAnswer);
  }
  
  if (answerInput) {
    addEventListener(answerInput, 'keydown', handleAnswerKeydown);
  }
}

/**
 * Setup mind keyboard shortcuts
 */
function setupMindKeyboardShortcuts() {
  addEventListener(document, 'keydown', (ev) => {
    const key = ev.key.toLowerCase();
    
    // Only handle mind shortcuts when modal is open
    const modal = getElementById('mindModal');
    if (!modal || !modal.classList.contains('show')) return;
    
    const activeElement = document.activeElement;
    
    // Handle escape key - always allow unfocusing
    if (key === 'escape') {
      ev.preventDefault();
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
      return;
    }
    
    // Handle enter key in any input field
    if (key === 'enter') {
      if (activeElement.id === 'mindAnswer') {
        ev.preventDefault();
        handleSubmitAnswer();
        return;
      }
      // For other inputs, let the default behavior happen
      return;
    }
    
    // If typing in any input field, block all other shortcuts
    if (isTypingContext(activeElement)) {
      // Allow normal typing characters (letters, numbers, symbols, space, backspace, etc.)
      if (key.length === 1 || key === 'Backspace' || key === 'Delete' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
        return; // Allow normal typing
      }
      // Block all other keybindings when typing
      return;
    }
    
    // Handle keyboard shortcuts (only when not typing)
    if (key === 'i') {
      ev.preventDefault();
      const answerInput = getElementById('mindAnswer');
      if (answerInput) {
        answerInput.focus();
      }
    }
    
    if (key === 'h') {
      ev.preventDefault();
      handleShowHint();
    }
    
    if (key === 'n') {
      ev.preventDefault();
      handleSkipExercise();
    }
    
    if (key === 'r') {
      ev.preventDefault();
      handleResetMind();
    }
    
    if (key === 's') {
      ev.preventDefault();
      if (isMindSessionActive()) {
        handleStopMind();
      } else {
        handleStartMind();
      }
    }
    
    if (key === ' ') {
      ev.preventDefault();
      if (!isMindSessionActive()) {
        handleStartMind();
      }
    }
    
    if (key === '?') {
      ev.preventDefault();
      showShortcutsModal();
    }
    
  });
}

/**
 * Check if element is typing context
 * @param {HTMLElement} el - Element to check
 * @returns {boolean} True if typing context
 */
function isTypingContext(el) {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (el.isContentEditable) return true;
  const ce = el.closest && el.closest('[contenteditable="true"]');
  if (ce) return true;
  return false;
}

/**
 * Handle start mind button click
 */
function handleStartMind() {
  if (isMindSessionActive()) {
    handleStopMind();
    return;
  }
  
  startMindSession();
  playMindExerciseStart();
  getNextExercise();
  startMindTimer();
  updateMindDisplay();
  updateStartButton('Stop Session');
  focusAnswerInput();
}

/**
 * Handle stop mind session
 */
function handleStopMind() {
  if (!isMindSessionActive()) return;
  
  endMindSession();
  clearMindTimer();
  updateMindDisplay();
  updateStartButton('Start Session');
  showSessionResults();
  
  // Update global progress chart
  if (window.updateMindProgressChart) {
    window.updateMindProgressChart();
  }
}

/**
 * Handle show hint button click
 */
function handleShowHint() {
  const currentExercise = getCurrentExercise();
  if (!currentExercise) return;
  
  playMindHint();
  showHint(currentExercise);
}

/**
 * Handle skip exercise button click
 */
function handleSkipExercise() {
  if (!isMindSessionActive()) return;
  
  getNextExercise();
  updateMindDisplay();
  focusAnswerInput();
}

/**
 * Handle reset mind button click
 */
function handleResetMind() {
  resetMindSession();
  clearMindTimer();
  updateMindDisplay();
  updateStartButton('Start Session');
  hideSessionResults();
}

/**
 * Handle submit answer button click
 */
function handleSubmitAnswer() {
  const answerInput = getElementById('mindAnswer');
  if (!answerInput) return;
  
  const userAnswer = answerInput.value.trim();
  if (!userAnswer) return;
  
  const result = submitAnswer(userAnswer);
  handleAnswerResult(result);
  
  // Clear input and get next exercise
  answerInput.value = '';
  setTimeout(() => {
    getNextExercise();
    updateMindDisplay();
    focusAnswerInput();
  }, 2000);
}

/**
 * Handle answer keydown events
 * @param {KeyboardEvent} ev - Keyboard event
 */
function handleAnswerKeydown(ev) {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    handleSubmitAnswer();
  }
}

/**
 * Handle answer result
 * @param {Object} result - Answer result
 */
function handleAnswerResult(result) {
  // Play appropriate sound based on result
  if (result.isCorrect) {
    if (result.isExact) {
      playMindCorrectAnswer();
    } else {
      playMindCorrectAnswer(); // Still play success sound for partial credit
    }
  } else {
    playMindWrongAnswer();
  }
  
  // Show feedback with partial credit information
  let feedbackMessage = '';
  let feedbackClass = '';
  
  if (result.isCorrect) {
    if (result.isExact) {
      feedbackMessage = `Perfect! +${result.points} points`;
      feedbackClass = 'correct';
    } else {
      feedbackMessage = `${result.feedback} +${result.points} points`;
      feedbackClass = 'partial';
    }
  } else {
    feedbackMessage = result.feedback || 'Incorrect';
    feedbackClass = 'incorrect';
  }
  
  showFeedback(feedbackMessage, feedbackClass);
  
  // Show detailed feedback for memory matrices with partial credit
  if (result.correctParts && result.correctParts.length > 0) {
    setTimeout(() => {
      showPartialCreditFeedback(result);
    }, 1500);
  }
  
  // Show explanation and solution after a delay
  setTimeout(() => {
    if (result.explanation) {
      showExplanation(result.explanation);
    }
    
    // Show solution for incorrect answers
    if (!result.isCorrect && result.correctAnswer) {
      showSolution(result.correctAnswer, result.explanation);
    }
  }, 2000);
}

/**
 * Show partial credit feedback for memory matrices
 * @param {Object} result - Answer result with partial credit info
 */
function showPartialCreditFeedback(result) {
  const feedbackEl = getElementById('mindFeedback');
  if (!feedbackEl) return;
  
  let detailedFeedback = '<div style="margin-top: 8px; font-size: 0.8rem;">';
  
  if (result.correctParts.length > 0) {
    detailedFeedback += '<div style="color: #10b981;">✓ Correct positions: ';
    detailedFeedback += result.correctParts.map(p => `Position ${p.position + 1} (${p.value})`).join(', ');
    detailedFeedback += '</div>';
  }
  
  if (result.incorrectParts.length > 0) {
    detailedFeedback += '<div style="color: #ef4444;">✗ Incorrect positions: ';
    detailedFeedback += result.incorrectParts.map(p => `Position ${p.position + 1} (you: ${p.userValue}, correct: ${p.correctValue})`).join(', ');
    detailedFeedback += '</div>';
  }
  
  detailedFeedback += '</div>';
  
  feedbackEl.innerHTML += detailedFeedback;
}

// Mind timer state
let mindTimer = null;
let mindTimerInterval = null;

/**
 * Start mind timer
 */
function startMindTimer() {
  if (mindTimer) return;
  
  mindTimer = setInterval(() => {
    const progress = getSessionProgress();
    if (!progress) {
      clearMindTimer();
      return;
    }
    
    updateTimerDisplay(progress);
    
    // Warning at 10 seconds remaining
    if (progress.remaining === 10) {
      playMindTimerWarning();
    }
    
    // End session when time is up
    if (progress.isComplete) {
      handleStopMind();
      playMindComplete();
    }
  }, 1000);
}

/**
 * Clear mind timer
 */
function clearMindTimer() {
  if (mindTimer) {
    clearInterval(mindTimer);
    mindTimer = null;
  }
}

/**
 * Update mind display
 */
function updateMindDisplay() {
  const session = getCurrentMindSession();
  const progress = getSessionProgress();
  const currentExercise = getCurrentExercise();
  
  if (!session || !progress) {
    hideExerciseDisplay();
    return;
  }
  
  if (currentExercise) {
    showExerciseDisplay(currentExercise);
  }
  
  updateProgressDisplay(progress);
  updateScoreDisplay(session.score);
}

/**
 * Show exercise display
 * @param {Object} exercise - Exercise object
 */
function showExerciseDisplay(exercise) {
  const questionEl = getElementById('mindQuestion');
  const categoryEl = getElementById('mindCategory');
  const difficultyEl = getElementById('mindDifficulty');
  
  if (questionEl) updateTextContent(questionEl, exercise.question);
  if (categoryEl) updateTextContent(categoryEl, exercise.category);
  if (difficultyEl) {
    updateTextContent(difficultyEl, exercise.difficulty.toUpperCase());
    removeClass(difficultyEl, 'easy medium hard');
    addClass(difficultyEl, exercise.difficulty);
  }
  
  // Show memory matrix if applicable
  if (exercise.type === 'memory_matrices' && exercise.matrix) {
    showMemoryMatrix(exercise.matrix);
  } else {
    hideMemoryMatrix();
  }
}

/**
 * Hide exercise display
 */
function hideExerciseDisplay() {
  const questionEl = getElementById('mindQuestion');
  const categoryEl = getElementById('mindCategory');
  const difficultyEl = getElementById('mindDifficulty');
  
  if (questionEl) updateTextContent(questionEl, 'No active exercise');
  if (categoryEl) updateTextContent(categoryEl, '');
  if (difficultyEl) updateTextContent(difficultyEl, '');
  
  hideMemoryMatrix();
}

/**
 * Show memory matrix
 * @param {Array} matrix - 3x3 matrix array
 */
function showMemoryMatrix(matrix) {
  const matrixEl = getElementById('mindMatrix');
  if (!matrixEl) return;
  
  let html = '<div class="memory-matrix">';
  matrix.forEach(row => {
    html += '<div class="matrix-row">';
    row.forEach(cell => {
      html += `<div class="matrix-cell">${cell}</div>`;
    });
    html += '</div>';
  });
  html += '</div>';
  
  updateInnerHTML(matrixEl, html);
  showElement(matrixEl);
  
  // Add countdown timer for memory matrix
  let timeLeft = 5;
  const countdownEl = document.createElement('div');
  countdownEl.style.cssText = 'text-align: center; color: #f59e0b; font-weight: 700; margin-top: 8px; font-size: 1.1rem;';
  countdownEl.textContent = `Memorize for ${timeLeft} seconds...`;
  matrixEl.appendChild(countdownEl);
  
  const countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = `Memorize for ${timeLeft} seconds...`;
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      hideElement(matrixEl);
    }
  }, 1000);
}

/**
 * Hide memory matrix
 */
function hideMemoryMatrix() {
  const matrixEl = getElementById('mindMatrix');
  if (matrixEl) {
    hideElement(matrixEl);
  }
}

/**
 * Update progress display
 * @param {Object} progress - Progress object
 */
function updateProgressDisplay(progress) {
  const timeEl = getElementById('mindTime');
  const progressEl = getElementById('mindProgress');
  const progressFillEl = getElementById('mindProgressFill');
  
  if (timeEl) {
    updateTextContent(timeEl, `${progress.remaining}s remaining`);
  }
  
  if (progressEl) {
    updateTextContent(progressEl, `${progress.exercisesCompleted} exercises completed`);
  }
  
  if (progressFillEl) {
    progressFillEl.style.width = `${progress.progress}%`;
  }
}

/**
 * Update score display
 * @param {number} score - Current score
 */
function updateScoreDisplay(score) {
  const scoreEl = getElementById('mindScore');
  if (scoreEl) {
    updateTextContent(scoreEl, `Score: ${score}`);
  }
}

/**
 * Update timer display
 * @param {Object} progress - Progress object
 */
function updateTimerDisplay(progress) {
  const timeEl = getElementById('mindTime');
  if (timeEl) {
    updateTextContent(timeEl, `${progress.remaining}s remaining`);
  }
}

/**
 * Update start button text
 * @param {string} text - Button text
 */
function updateStartButton(text) {
  const startBtn = getElementById('mindStart');
  if (startBtn) {
    updateTextContent(startBtn, text);
  }
}

/**
 * Focus answer input
 */
function focusAnswerInput() {
  const answerInput = getElementById('mindAnswer');
  if (answerInput) {
    focusElement(answerInput);
  }
}

/**
 * Show hint
 * @param {Object} exercise - Exercise object
 */
function showHint(exercise) {
  const hintEl = getElementById('mindHintDisplay');
  if (hintEl) {
    updateTextContent(hintEl, exercise.explanation || 'No hint available');
    showElement(hintEl);
    
    // Hide hint after 5 seconds
    setTimeout(() => {
      hideElement(hintEl);
    }, 5000);
  }
}

/**
 * Show feedback
 * @param {string} message - Feedback message
 * @param {string} type - Feedback type
 */
function showFeedback(message, type) {
  const feedbackEl = getElementById('mindFeedback');
  if (feedbackEl) {
    updateTextContent(feedbackEl, message);
    removeClass(feedbackEl, 'correct incorrect');
    addClass(feedbackEl, type);
    showElement(feedbackEl);
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      hideElement(feedbackEl);
    }, 3000);
  }
}

/**
 * Show explanation
 * @param {string} explanation - Explanation text
 */
function showExplanation(explanation) {
  const explanationEl = getElementById('mindExplanation');
  if (explanationEl) {
    updateTextContent(explanationEl, explanation);
    showElement(explanationEl);
    
    // Hide explanation after 5 seconds
    setTimeout(() => {
      hideElement(explanationEl);
    }, 5000);
  }
}

/**
 * Show solution for failed exercises
 * @param {string} correctAnswer - Correct answer
 * @param {string} explanation - Explanation text
 */
function showSolution(correctAnswer, explanation) {
  const solutionEl = getElementById('mindSolution');
  if (!solutionEl) {
    // Create solution element if it doesn't exist
    const exerciseEl = getElementById('mindExercise');
    if (exerciseEl) {
      const solutionDiv = document.createElement('div');
      solutionDiv.id = 'mindSolution';
      solutionDiv.className = 'mind-solution';
      solutionDiv.style.display = 'none';
      exerciseEl.appendChild(solutionDiv);
    }
  }
  
  if (solutionEl) {
    const solutionHTML = `
      <div style="padding: 12px 16px; background: linear-gradient(135deg, #7f1d1d, #ef4444); border-radius: 8px; color: #ffffff; margin-bottom: 12px; border-left: 4px solid #ef4444; animation: solutionSlide 0.5s ease-out;">
        <div style="font-weight: 700; margin-bottom: 8px; font-size: 1rem;">💡 Solution:</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px;">${correctAnswer}</div>
        ${explanation ? `<div style="font-size: 0.9rem; opacity: 0.9;">${explanation}</div>` : ''}
      </div>
    `;
    updateInnerHTML(solutionEl, solutionHTML);
    showElement(solutionEl);
    
    // Hide solution after 8 seconds
    setTimeout(() => {
      hideElement(solutionEl);
    }, 8000);
  }
}

/**
 * Show session results
 */
function showSessionResults() {
  const session = getCurrentMindSession();
  if (!session) return;
  
  const resultsEl = getElementById('mindResults');
  if (resultsEl) {
    const html = `
      <div class="session-results">
        <h4>Session Complete!</h4>
        <p>Final Score: ${session.score}</p>
        <p>Exercises Completed: ${session.exercises.length}</p>
        <p>Average Score: ${Math.round(session.score / Math.max(session.exercises.length, 1))}</p>
      </div>
    `;
    updateInnerHTML(resultsEl, html);
    showElement(resultsEl);
  }
}

/**
 * Hide session results
 */
function hideSessionResults() {
  const resultsEl = getElementById('mindResults');
  if (resultsEl) {
    hideElement(resultsEl);
  }
}

/**
 * Update statistics display
 * @param {Object} stats - Statistics object
 */
function updateStatisticsDisplay(stats) {
  const statsEl = getElementById('mindStats');
  if (statsEl) {
    const html = `
      <div class="mind-statistics">
        <div>Total Sessions: ${stats.totalSessions}</div>
        <div>Best Score: ${stats.bestScore}</div>
        <div>Average Score: ${stats.averageScore}</div>
        <div>Total Exercises: ${stats.totalExercises}</div>
      </div>
    `;
    updateInnerHTML(statsEl, html);
  }
}

/**
 * Show mind modal
 */
export function showMindModal() {
  const modal = getElementById('mindModal');
  if (modal) {
    addClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'false');
    renderMindInterface();
    updateMindDisplay();
    // Auto-start the session when modal opens
    setTimeout(() => {
      if (!isMindSessionActive()) {
        handleStartMind();
      }
    }, 100); // Small delay to ensure modal is fully visible
  }
}

/**
 * Hide mind modal
 */
export function hideMindModal() {
  const modal = getElementById('mindModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
    if (isMindSessionActive()) {
      handleStopMind();
    }
  }
}

/**
 * Show shortcuts modal
 */
function showShortcutsModal() {
  const modal = getElementById('mindShortcutsModal');
  if (modal) {
    addClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hide shortcuts modal
 */
function hideShortcutsModal() {
  const modal = getElementById('mindShortcutsModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
  }
}
