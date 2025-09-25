/**
 * Presentation layer for Exercise UI
 * Handles exercise interface and user interactions
 */

import { getCurrentExerciseInfo, getExerciseProgress, moveToNextExercise, resetExerciseCycle, getCurrentExerciseTiming } from '../application/ExerciseService.js';
import { getElementById, updateTextContent, addClass, removeClass, addEventListener } from '../infrastructure/UI.js';
import { playBeep, playExerciseCompleteBeep } from '../infrastructure/Audio.js';

/**
 * Initialize exercise functionality
 */
export function initializeExercise() {
  renderCurrentExercise();
  setupExerciseControls();
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
  
  if (titleEl) updateTextContent(titleEl, info.title);
  if (subtitleEl) updateTextContent(subtitleEl, info.subtitle);
  if (notesEl) updateTextContent(notesEl, info.notes);
  if (progressEl) updateTextContent(progressEl, info.progress);
}

/**
 * Setup exercise control buttons
 */
function setupExerciseControls() {
  const startBtn = getElementById('exStart');
  const skipBtn = getElementById('exSkip');
  const resetBtn = getElementById('exReset');
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleStartExercise);
  }
  
  if (skipBtn) {
    addEventListener(skipBtn, 'click', handleSkipExercise);
  }
  
  if (resetBtn) {
    addEventListener(resetBtn, 'click', handleResetExercise);
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
  playBeep(660, 150);
  
  exerciseTimer = setInterval(() => {
    if (exerciseState === 'prep') {
      exercisePrepCount -= 1;
      updateStartButton(`Get ready… ${Math.max(exercisePrepCount, 0)}s`);
      
      if (exercisePrepCount <= 0) {
        exerciseState = 'work';
        exerciseRepCount = 1;
        updateStartButton(`Rep ${exerciseRepCount}/${reps} — 4s`);
        playBeep(880, 180);
      }
      return;
    }
    
    if (exerciseState === 'work') {
      exerciseSeconds += 1;
      const within = 4 - ((exerciseSeconds - 1) % 4);
      updateStartButton(`Rep ${exerciseRepCount}/${reps} — ${within}s`);
      
      if ((exerciseSeconds - 1) % 4 === 0) {
        playBeep(880, 160);
      }
      
      if (exerciseSeconds % 4 === 0) {
        if (exerciseRepCount >= reps) {
          clearInterval(exerciseTimer);
          exerciseTimer = null;
          exerciseRunning = false;
          updateStartButton('Start set');
          playExerciseCompleteBeep();
          
          // Move to next exercise
          moveToNextExercise();
          renderCurrentExercise();
          return;
        }
        exerciseRepCount += 1;
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
}

/**
 * Update start button text
 * @param {string} text - Button text
 */
function updateStartButton(text) {
  const startBtn = getElementById('exStart');
  if (startBtn) {
    updateTextContent(startBtn, text);
  }
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
