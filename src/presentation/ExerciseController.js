/**
 * Presentation layer for Exercise UI
 * Handles exercise interface and user interactions
 */

import { getCurrentExerciseInfo, getExerciseProgress, moveToNextExercise, resetExerciseCycle, getCurrentExerciseTiming } from '../application/ExerciseService.js';
import { getElementById, updateTextContent, addClass, removeClass, addEventListener } from '../infrastructure/UI.js';
import { isTopModal } from './ModalManager.js';
import { showShortcutsModal } from './ShortcutsController.js';
import { playBeep, playExerciseCompleteBeep } from '../infrastructure/Audio.js';

/**
 * Initialize exercise functionality
 */
export function initializeExercise() {
  renderCurrentExercise();
  setupExerciseControls();
  setupExerciseKeyboardShortcuts();
}

/**
 * Render current exercise information
 */
export function renderCurrentExercise() {
  const info = getCurrentExerciseInfo();
  if (!info) return;
  
  const titleEl = getElementById('exTitle');
  const subtitleEl = getElementById('exSubtitle');
  const notesEl = getElementById('exNotes');
  const progressEl = getElementById('exProgress');
  // Modal equivalents
  const titleElModal = getElementById('exTitleModal');
  const subtitleElModal = getElementById('exSubtitleModal');
  const notesElModal = getElementById('exNotesModal');
  const progressElModal = getElementById('exProgressModal');
  // Activities card equivalents
  const cardSetInfoEl = document.getElementById('exerciseSetInfo');
  const cardProgressTextEl = document.getElementById('exerciseProgressText');
  
  if (titleEl) updateTextContent(titleEl, info.title);
  if (subtitleEl) updateTextContent(subtitleEl, info.subtitle);
  if (notesEl) updateTextContent(notesEl, info.notes);
  if (progressEl) updateTextContent(progressEl, info.progress);
  if (titleElModal) updateTextContent(titleElModal, info.title);
  if (subtitleElModal) updateTextContent(subtitleElModal, info.subtitle);
  if (notesElModal) updateTextContent(notesElModal, info.notes);
  if (progressElModal) updateTextContent(progressElModal, info.progress);
  if (cardSetInfoEl) updateTextContent(cardSetInfoEl, info.title);
  // Show concise set info on card (avoid verbose cycle notes)
  if (cardProgressTextEl) updateTextContent(cardProgressTextEl, info.subtitle);
}

/**
 * Setup exercise control buttons
 */
function setupExerciseControls() {
  const startBtn = getElementById('exStart');
  const skipBtn = getElementById('exSkip');
  const resetBtn = getElementById('exReset');
  // Modal equivalents
  const startBtnModal = getElementById('exStartModal');
  const skipBtnModal = getElementById('exSkipModal');
  const resetBtnModal = getElementById('exResetModal');
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleStartExercise);
  }
  if (startBtnModal) {
    addEventListener(startBtnModal, 'click', handleStartExercise);
  }
  
  if (skipBtn) {
    addEventListener(skipBtn, 'click', handleSkipExercise);
  }
  if (skipBtnModal) {
    addEventListener(skipBtnModal, 'click', handleSkipExercise);
  }
  
  if (resetBtn) {
    addEventListener(resetBtn, 'click', handleResetExercise);
  }
  if (resetBtnModal) {
    addEventListener(resetBtnModal, 'click', handleResetExercise);
  }
}

/**
 * Handle start exercise button click
 */
function handleStartExercise() {
  if (isExerciseRunning()) {
    cancelExercise();
  } else {
    startExercise();
  }
}

/**
 * Handle skip exercise button click
 */
function handleSkipExercise() {
  moveToNextExercise();
  renderCurrentExercise();
  cancelExercise();
}

/**
 * Handle reset exercise button click
 */
function handleResetExercise() {
  resetExerciseCycle();
  renderCurrentExercise();
  cancelExercise();
}

// Exercise timer state
let exerciseTimer = null;
let exerciseSeconds = 0;
let exerciseState = 'prep';
let exercisePrepCount = 5;
let exerciseRepCount = 0;
let exerciseRunning = false;

/**
 * Check if exercise is currently running
 * @returns {boolean} True if running
 */
function isExerciseRunning() {
  return exerciseRunning;
}

/**
 * Start exercise timer
 */
function startExercise() {
  if (exerciseRunning) return;
  
  exerciseRunning = true;
  const timing = getCurrentExerciseTiming();
  if (!timing) return;
  
  const reps = timing.reps;
  exerciseState = 'prep';
  exercisePrepCount = 5;
  exerciseRepCount = 0;
  exerciseSeconds = 0;
  
  updateStartButton('Get ready… 5s');
  updateExerciseProgress(0, 'Preparing...');
  playBeep(660, 150);
  
  exerciseTimer = setInterval(() => {
    if (exerciseState === 'prep') {
      exercisePrepCount -= 1;
      const prepProgress = ((5 - exercisePrepCount) / 5) * 10; // 0-10% for prep
      updateStartButton(`Get ready… ${Math.max(exercisePrepCount, 0)}s`);
      updateExerciseProgress(prepProgress, `Get ready... ${Math.max(exercisePrepCount, 0)}s`);
      
      if (exercisePrepCount <= 0) {
        exerciseState = 'work';
        exerciseRepCount = 1;
        updateStartButton(`Rep ${exerciseRepCount}/${reps} — 4s`);
        updateExerciseProgress(10, `Starting rep ${exerciseRepCount}/${reps}`);
        playBeep(880, 180);
      }
      return;
    }
    
    if (exerciseState === 'work') {
      exerciseSeconds += 1;
      const within = 4 - ((exerciseSeconds - 1) % 4);
      updateStartButton(`Rep ${exerciseRepCount}/${reps} — ${within}s`);
      
      // Calculate progress: 10% prep + 90% work
      const workProgress = ((exerciseRepCount - 1) * 4 + (4 - within)) / (reps * 4) * 90;
      const totalProgress = 10 + workProgress;
      updateExerciseProgress(totalProgress, `Rep ${exerciseRepCount}/${reps} — ${within}s`);
      
      if ((exerciseSeconds - 1) % 4 === 0) {
        playBeep(880, 160);
      }
      
      if (exerciseSeconds % 4 === 0) {
        if (exerciseRepCount >= reps) {
          clearInterval(exerciseTimer);
          exerciseTimer = null;
          exerciseRunning = false;
          updateStartButton('Start set');
          updateExerciseProgress(100, 'Exercise completed! 🎉');
          playExerciseCompleteBeep();
          
          // Close modal on completion
          const modal = document.getElementById('exerciseModal');
          if (modal && modal.classList.contains('show')) {
            hideExerciseModal();
          }
          
          // Move to next exercise
          moveToNextExercise();
          renderCurrentExercise();
          return;
        }
        exerciseRepCount += 1;
        updateExerciseProgress(10 + ((exerciseRepCount - 1) / reps) * 90, `Starting rep ${exerciseRepCount}/${reps}`);
      }
    }
  }, 1000);
}

/**
 * Cancel exercise timer
 */
function cancelExercise() {
  if (exerciseTimer) {
    clearInterval(exerciseTimer);
    exerciseTimer = null;
  }
  exerciseRunning = false;
  updateStartButton('Start set');
  updateExerciseProgress(0, 'Ready to start');
}

/**
 * Update start button text
 * @param {string} text - Button text
 */
function updateStartButton(text) {
  const startBtn = getElementById('exStart');
  const startBtnModal = getElementById('exStartModal');
  if (startBtn) updateTextContent(startBtn, text);
  if (startBtnModal) updateTextContent(startBtnModal, text);
}

/**
 * Update exercise progress visualization
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} statusText - Status text to display
 */
function updateExerciseProgress(progress, statusText) {
  const progressContainer = getElementById('exerciseProgressContainer');
  const progressFill = getElementById('exerciseProgressFill');
  const progressText = getElementById('exerciseProgressText');
  const statusElement = getElementById('exerciseStatus');
  const statusTextElement = getElementById('exerciseStatusText');
  
  if (progressContainer) {
    if (progress > 0) {
      progressContainer.style.display = 'flex';
    } else {
      progressContainer.style.display = 'none';
    }
  }
  
  if (progressFill) {
    progressFill.style.width = `${Math.min(progress, 100)}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${Math.round(progress)}%`;
  }
  
  if (statusElement && statusTextElement) {
    if (statusText) {
      statusElement.style.display = 'inline-flex';
      statusTextElement.textContent = statusText;
      
      // Update status styling based on exercise state
      statusElement.className = 'exercise-status';
      if (exerciseRunning) {
        statusElement.classList.add('running');
      } else if (progress >= 100) {
        statusElement.classList.add('completed');
      }
    } else {
      statusElement.style.display = 'none';
    }
  }
}

/**
 * Show exercise modal and autostart
 */
export function showExerciseModal() {
  const modal = getElementById('exerciseModal');
  if (modal) {
    addClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'false');
    renderCurrentExercise();
    // Auto-start shortly after opening
    setTimeout(() => {
      if (!isExerciseRunning()) {
        startExercise();
      }
    }, 100);
  }
}

/**
 * Hide exercise modal
 */
export function hideExerciseModal() {
  const modal = getElementById('exerciseModal');
  if (modal) {
    // Stop any running timers/processes when closing the modal
    cancelExercise();
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Setup keyboard shortcuts for Exercise modal
 */
function setupExerciseKeyboardShortcuts() {
  addEventListener(document, 'keydown', (ev) => {
    const key = ev.key.toLowerCase();
    const modal = getElementById('exerciseModal');
    if (!modal || !modal.classList.contains('show')) return;
    if (!isTopModal('exerciseModal')) return;
    
    // typing contexts: allow normal behavior
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      return;
    }
    
    if (key === 's') {
      ev.preventDefault();
      const skip = getElementById('exSkipModal') || getElementById('exSkip');
      if (skip) skip.click();
      return;
    }
    if (key === 'r') {
      ev.preventDefault();
      const reset = getElementById('exResetModal') || getElementById('exReset');
      if (reset) reset.click();
      return;
    }
    if (key === '?') {
      ev.preventDefault();
      showShortcutsModal('exercise');
      return;
    }
  });
}

/**
 * Create hover cancel controller for buttons
 * @param {HTMLElement} button - Button element
 * @param {string} defaultLabel - Default button label
 * @returns {Object} Controller object
 */
export function createHoverCancelController(button, defaultLabel) {
  let hover = false;
  let running = false;
  let currentLabel = defaultLabel;
  let lockedWidthPx = '';
  
  function setLabel(text) {
    currentLabel = text;
    if (hover && running) {
      updateTextContent(button, 'Cancel');
    } else {
      updateTextContent(button, text);
    }
  }
  
  function start() {
    running = true;
    setLabel(currentLabel);
    removeClass(button, 'cancel');
  }
  
  function stop() {
    running = false;
    hover = false;
    currentLabel = defaultLabel;
    removeClass(button, 'cancel');
    button.style.width = '';
    updateTextContent(button, defaultLabel);
  }
  
  addEventListener(button, 'mouseenter', () => {
    if (running) {
      hover = true;
      const currentW = Math.ceil(button.getBoundingClientRect().width);
      updateTextContent(button, 'Cancel');
      const cancelW = Math.ceil(button.getBoundingClientRect().width);
      const w = Math.max(currentW, cancelW);
      lockedWidthPx = w ? `${w}px` : '';
      if (lockedWidthPx) button.style.width = lockedWidthPx;
      addClass(button, 'cancel');
      updateTextContent(button, 'Cancel');
    }
  });
  
  addEventListener(button, 'mouseleave', () => {
    if (running) {
      hover = false;
      removeClass(button, 'cancel');
      updateTextContent(button, currentLabel);
    }
    button.style.width = '';
    lockedWidthPx = '';
  });
  
  return {
    setLabel,
    start,
    stop,
    isRunning: () => running,
    setRunning: (v) => { running = v; },
    isHover: () => hover
  };
}
