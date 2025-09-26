/**
 * Presentation layer for Brain Training UI
 * Handles brain training interface and user interactions with full keyboard support
 */

import { 
  startBrainTrainingSession,
  getCurrentBrainTrainingSession,
  updateBrainTrainingSession,
  endBrainTrainingSession,
  getNextBrainTrainingExercise,
  getCurrentBrainTrainingExercise,
  submitBrainTrainingAnswer,
  getBrainTrainingSessionProgress,
  getBrainTrainingStatisticsData,
  isBrainTrainingSessionActive,
  resetBrainTrainingSession
} from '../application/BrainTrainingService.js';
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
  playBrainTrainingStart,
  playBrainTrainingCorrect,
  playBrainTrainingWrong,
  playBrainTrainingHint,
  playBrainTrainingTimerWarning,
  playBrainTrainingComplete
} from '../infrastructure/Audio.js';
import { isTopModal } from './ModalManager.js';

/**
 * Initialize brain training functionality
 */
export function initializeBrainTraining() {
  renderBrainTrainingInterface();
  setupBrainTrainingControls();
  setupBrainTrainingKeyboardShortcuts();
  setupBrainTrainingModal();
}

/**
 * Render brain training interface
 */
export function renderBrainTrainingInterface() {
  const stats = getBrainTrainingStatisticsData();
  updateStatisticsDisplay(stats);
}

/**
 * Setup brain training modal
 */
function setupBrainTrainingModal() {
  const openBtn = getElementById('brainTrainingBtn');
  const modal = getElementById('brainTrainingModal');
  const closeBtn = getElementById('brainTrainingClose');
  const shortcutsBtn = getElementById('brainTrainingShortcutsBtn');
  
  if (openBtn) {
    addEventListener(openBtn, 'click', () => {
      showBrainTrainingModal();
    });
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', () => {
      hideBrainTrainingModal();
    });
  }
  
  if (shortcutsBtn) {
    addEventListener(shortcutsBtn, 'click', () => {
      showShortcutsModal('brainTraining');
    });
  }
}

/**
 * Setup brain training control buttons
 */
function setupBrainTrainingControls() {
  const startBtn = getElementById('brainTrainingStart');
  const stopBtn = getElementById('brainTrainingStop');
  const hintBtn = getElementById('brainTrainingHint');
  const skipBtn = getElementById('brainTrainingSkip');
  const resetBtn = getElementById('brainTrainingReset');
  const answerInput = getElementById('brainTrainingAnswer');
  const submitBtn = getElementById('brainTrainingSubmit');
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleStartBrainTraining);
  }
  
  if (stopBtn) {
    addEventListener(stopBtn, 'click', handleStopBrainTraining);
  }
  
  if (hintBtn) {
    addEventListener(hintBtn, 'click', handleShowHint);
  }
  
  if (skipBtn) {
    addEventListener(skipBtn, 'click', handleSkipExercise);
  }
  
  if (resetBtn) {
    addEventListener(resetBtn, 'click', handleResetBrainTraining);
  }
  
  if (submitBtn) {
    addEventListener(submitBtn, 'click', handleSubmitAnswer);
  }
  
  if (answerInput) {
    addEventListener(answerInput, 'keydown', handleAnswerKeydown);
  }
}

/**
 * Setup brain training keyboard shortcuts
 */
function setupBrainTrainingKeyboardShortcuts() {
  addEventListener(document, 'keydown', (ev) => {
    const key = ev.key.toLowerCase();
    
    // Only handle brain training shortcuts when modal is open
    const modal = getElementById('brainTrainingModal');
    if (!modal || !modal.classList.contains('show')) return;
    if (!isTopModal('brainTrainingModal')) return;
    
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
      if (activeElement.id === 'brainTrainingAnswer') {
        ev.preventDefault();
        handleSubmitAnswer();
        return;
      }
      return;
    }
    
    // If typing in any input field, block all other shortcuts
    if (isTypingContext(activeElement)) {
      if (key.length === 1 || key === 'Backspace' || key === 'Delete' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
        return; // Allow normal typing
      }
      return;
    }
    
    // Handle keyboard shortcuts (only when not typing)
    if (key === 'i') {
      ev.preventDefault();
      const answerInput = getElementById('brainTrainingAnswer');
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
      handleResetBrainTraining();
    }
    
    if (key === 's') {
      ev.preventDefault();
      if (isBrainTrainingSessionActive()) {
        handleStopBrainTraining();
      } else {
        handleStartBrainTraining();
      }
    }
    
    if (key === ' ') {
      ev.preventDefault();
      if (!isBrainTrainingSessionActive()) {
        handleStartBrainTraining();
      }
    }
    
    if (key === '?') {
      ev.preventDefault();
      showShortcutsModal('brainTraining');
    }
    
    if (key === 'q') {
      ev.preventDefault();
      hideBrainTrainingModal();
    }
    
    // Memory matrix navigation (1-9 keys)
    if (key >= '1' && key <= '9') {
      ev.preventDefault();
      handleMemoryMatrixSelection(parseInt(key));
    }
  });
}

/**
 * Handle memory matrix cell selection
 * @param {number} cellNumber - Cell number (1-9)
 */
function handleMemoryMatrixSelection(cellNumber) {
  const matrixGrid = getElementById('brainTrainingMatrixGrid');
  if (!matrixGrid) return;
  
  const cells = matrixGrid.querySelectorAll('.matrix-cell');
  if (cellNumber < 1 || cellNumber > cells.length) return;
  
  const cell = cells[cellNumber - 1];
  if (cell) {
    cell.click();
  }
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
 * Handle start brain training button click
 */
function handleStartBrainTraining() {
  if (isBrainTrainingSessionActive()) {
    handleStopBrainTraining();
    return;
  }
  
  startBrainTrainingSession();
  playBrainTrainingStart();
  getNextBrainTrainingExercise();
  startBrainTrainingTimer();
  updateBrainTrainingDisplay();
  updateStartButton('Stop Session');
  focusAnswerInput();
}

/**
 * Handle stop brain training session
 */
function handleStopBrainTraining() {
  if (!isBrainTrainingSessionActive()) return;
  
  endBrainTrainingSession();
  clearBrainTrainingTimer();
  updateBrainTrainingDisplay();
  updateStartButton('Start Session');
  showSessionResults();
  
  // Update global progress chart
  if (window.updateBrainTrainingProgressChart) {
    window.updateBrainTrainingProgressChart();
  }
}

/**
 * Handle show hint button click
 */
function handleShowHint() {
  const currentExercise = getCurrentBrainTrainingExercise();
  if (!currentExercise) return;
  
  playBrainTrainingHint();
  showHint(currentExercise);
}

/**
 * Handle skip exercise button click
 */
function handleSkipExercise() {
  if (!isBrainTrainingSessionActive()) return;
  
  getNextBrainTrainingExercise();
  updateBrainTrainingDisplay();
  focusAnswerInput();
}

/**
 * Handle reset brain training button click
 */
function handleResetBrainTraining() {
  resetBrainTrainingSession();
  clearBrainTrainingTimer();
  updateBrainTrainingDisplay();
  updateStartButton('Start Session');
  hideSessionResults();
}

/**
 * Handle submit answer button click
 */
function handleSubmitAnswer() {
  const answerInput = getElementById('brainTrainingAnswer');
  if (!answerInput) return;
  
  const userAnswer = answerInput.value.trim();
  if (!userAnswer) return;
  
  const result = submitBrainTrainingAnswer(userAnswer);
  handleAnswerResult(result);
  
  // Clear input and get next exercise
  answerInput.value = '';
  setTimeout(() => {
    getNextBrainTrainingExercise();
    updateBrainTrainingDisplay();
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
      playBrainTrainingCorrect();
    } else {
      playBrainTrainingCorrect(); // Still play success sound for partial credit
    }
  } else {
    playBrainTrainingWrong();
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
  const feedbackEl = getElementById('brainTrainingFeedback');
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

// Brain training timer state
let brainTrainingTimer = null;
let brainTrainingTimerInterval = null;

/**
 * Start brain training timer
 */
function startBrainTrainingTimer() {
  if (brainTrainingTimer) return;
  
  brainTrainingTimer = setInterval(() => {
    const progress = getBrainTrainingSessionProgress();
    if (!progress) {
      clearBrainTrainingTimer();
      return;
    }
    
    updateTimerDisplay(progress);
    
    // Warning at 10 seconds remaining
    if (progress.remaining === 10) {
      playBrainTrainingTimerWarning();
    }
    
    // End session when time is up
    if (progress.isComplete) {
      handleStopBrainTraining();
      playBrainTrainingComplete();
    }
  }, 1000);
}

/**
 * Clear brain training timer
 */
function clearBrainTrainingTimer() {
  if (brainTrainingTimer) {
    clearInterval(brainTrainingTimer);
    brainTrainingTimer = null;
  }
}

/**
 * Update brain training display
 */
function updateBrainTrainingDisplay() {
  const session = getCurrentBrainTrainingSession();
  const progress = getBrainTrainingSessionProgress();
  const currentExercise = getCurrentBrainTrainingExercise();
  
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
  const questionEl = getElementById('brainTrainingQuestion');
  const categoryEl = getElementById('brainTrainingCategory');
  const difficultyEl = getElementById('brainTrainingDifficulty');
  
  if (questionEl) {
    const questionText = questionEl.querySelector('.question-text');
    if (questionText) updateTextContent(questionText, exercise.question);
  }
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
  
  // Show answer section
  const answerSection = getElementById('brainTrainingAnswerSection');
  if (answerSection) {
    showElement(answerSection);
  }
}

/**
 * Hide exercise display
 */
function hideExerciseDisplay() {
  const questionEl = getElementById('brainTrainingQuestion');
  const categoryEl = getElementById('brainTrainingCategory');
  const difficultyEl = getElementById('brainTrainingDifficulty');
  
  if (questionEl) {
    const questionText = questionEl.querySelector('.question-text');
    if (questionText) updateTextContent(questionText, 'No active exercise');
  }
  if (categoryEl) updateTextContent(categoryEl, '');
  if (difficultyEl) updateTextContent(difficultyEl, '');
  
  hideMemoryMatrix();
  
  const answerSection = getElementById('brainTrainingAnswerSection');
  if (answerSection) {
    hideElement(answerSection);
  }
}

/**
 * Show memory matrix
 * @param {Array} matrix - 3x3 matrix array
 */
function showMemoryMatrix(matrix) {
  const matrixEl = getElementById('brainTrainingMatrix');
  const matrixGridEl = getElementById('brainTrainingMatrixGrid');
  if (!matrixEl || !matrixGridEl) return;
  
  let html = '';
  matrix.forEach(row => {
    html += '<div class="matrix-row">';
    row.forEach(cell => {
      html += `<div class="matrix-cell">${cell}</div>`;
    });
    html += '</div>';
  });
  
  updateInnerHTML(matrixGridEl, html);
  showElement(matrixEl);
  
  // Add countdown timer for memory matrix
  let timeLeft = 5;
  const timerEl = getElementById('brainTrainingMatrixTimer');
  if (timerEl) {
    updateTextContent(timerEl, `Memorize for ${timeLeft} seconds...`);
  }
  
  const countdownInterval = setInterval(() => {
    timeLeft--;
    if (timerEl) {
      updateTextContent(timerEl, `Memorize for ${timeLeft} seconds...`);
    }
    
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
  const matrixEl = getElementById('brainTrainingMatrix');
  if (matrixEl) {
    hideElement(matrixEl);
  }
}

/**
 * Update progress display
 * @param {Object} progress - Progress object
 */
function updateProgressDisplay(progress) {
  const timeEl = getElementById('brainTrainingTime');
  const progressEl = getElementById('brainTrainingProgress');
  const progressFillEl = getElementById('brainTrainingProgressFill');
  
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
  const scoreEl = getElementById('brainTrainingScore');
  if (scoreEl) {
    updateTextContent(scoreEl, `Score: ${score}`);
  }
}

/**
 * Update timer display
 * @param {Object} progress - Progress object
 */
function updateTimerDisplay(progress) {
  const timeEl = getElementById('brainTrainingTime');
  if (timeEl) {
    updateTextContent(timeEl, `${progress.remaining}s remaining`);
  }
}

/**
 * Update start button text
 * @param {string} text - Button text
 */
function updateStartButton(text) {
  const startBtn = getElementById('brainTrainingStart');
  const stopBtn = getElementById('brainTrainingStop');
  
  if (text === 'Stop Session') {
    if (startBtn) hideElement(startBtn);
    if (stopBtn) showElement(stopBtn);
  } else {
    if (startBtn) showElement(startBtn);
    if (stopBtn) hideElement(stopBtn);
  }
}

/**
 * Focus answer input
 */
function focusAnswerInput() {
  const answerInput = getElementById('brainTrainingAnswer');
  if (answerInput) {
    focusElement(answerInput);
  }
}

/**
 * Show hint
 * @param {Object} exercise - Exercise object
 */
function showHint(exercise) {
  const hintEl = getElementById('brainTrainingHint');
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
  const feedbackEl = getElementById('brainTrainingFeedback');
  if (feedbackEl) {
    updateTextContent(feedbackEl, message);
    removeClass(feedbackEl, 'correct incorrect partial');
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
  const explanationEl = getElementById('brainTrainingExplanation');
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
  const solutionEl = getElementById('brainTrainingSolution');
  if (!solutionEl) {
    // Create solution element if it doesn't exist
    const exerciseEl = getElementById('brainTrainingExercise');
    if (exerciseEl) {
      const solutionDiv = document.createElement('div');
      solutionDiv.id = 'brainTrainingSolution';
      solutionDiv.className = 'exercise-solution';
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
  const session = getCurrentBrainTrainingSession();
  if (!session) return;
  
  const resultsEl = getElementById('brainTrainingResults');
  const resultsContentEl = getElementById('brainTrainingResultsContent');
  if (resultsEl && resultsContentEl) {
    const html = `
      <div class="session-results">
        <div class="result-stat">
          <span class="result-label">Final Score:</span>
          <span class="result-value">${session.score}</span>
        </div>
        <div class="result-stat">
          <span class="result-label">Exercises Completed:</span>
          <span class="result-value">${session.exercises.length}</span>
        </div>
        <div class="result-stat">
          <span class="result-label">Average Score:</span>
          <span class="result-value">${Math.round(session.score / Math.max(session.exercises.length, 1))}</span>
        </div>
        <div class="result-stat">
          <span class="result-label">Session Duration:</span>
          <span class="result-value">${Math.round((Date.now() - session.startTime) / 1000)}s</span>
        </div>
      </div>
    `;
    updateInnerHTML(resultsContentEl, html);
    showElement(resultsEl);
  }
}

/**
 * Hide session results
 */
function hideSessionResults() {
  const resultsEl = getElementById('brainTrainingResults');
  if (resultsEl) {
    hideElement(resultsEl);
  }
}

/**
 * Update statistics display
 * @param {Object} stats - Statistics object
 */
function updateStatisticsDisplay(stats) {
  const sessionsEl = getElementById('brainTrainingSessions');
  const bestScoreEl = getElementById('brainTrainingBestScore');
  const avgScoreEl = getElementById('brainTrainingAvgScore');
  const streakEl = getElementById('brainTrainingStreak');
  
  if (sessionsEl) updateTextContent(sessionsEl, stats.totalSessions || 0);
  if (bestScoreEl) updateTextContent(bestScoreEl, stats.bestScore || 0);
  if (avgScoreEl) updateTextContent(avgScoreEl, stats.averageScore || 0);
  if (streakEl) updateTextContent(streakEl, stats.currentStreak || 0);
}

/**
 * Show brain training modal
 */
export function showBrainTrainingModal() {
  const modal = getElementById('brainTrainingModal');
  if (modal) {
    addClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'false');
    renderBrainTrainingInterface();
    updateBrainTrainingDisplay();
    // Auto-start the session when modal opens
    setTimeout(() => {
      if (!isBrainTrainingSessionActive()) {
        handleStartBrainTraining();
      }
    }, 100); // Small delay to ensure modal is fully visible
  }
}

/**
 * Hide brain training modal
 */
export function hideBrainTrainingModal() {
  const modal = getElementById('brainTrainingModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
    if (isBrainTrainingSessionActive()) {
      handleStopBrainTraining();
    }
  }
}

/**
 * Show brain training shortcuts modal
 */
function showBrainTrainingShortcutsModal() {
  // This would integrate with the existing shortcuts system
  if (window.showShortcutsModal) {
    window.showShortcutsModal('brainTraining');
  }
}
