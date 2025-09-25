/**
 * Main application entry point
 * Orchestrates all modules using clean architecture
 */

// Import domain layer
import { createJournalEntry, validateJournalEntry, sortJournalEntries, formatJournalEntry } from './src/domain/Journal.js';
import { getExerciseRoutine, createFlatExerciseArray, calculateExerciseProgress, getExerciseInfo, calculateExerciseTiming } from './src/domain/Exercise.js';
import { normalizeTextToParagraphs, countWords, computeChunk, calculateReadingTime, calculateWordInterval, splitTextIntoWords, validateWPM, calculateReadingProgress } from './src/domain/Reading.js';
import { createCanvasState, applyTransform, calculateMousePosition, calculateZoomAdjustment, createStroke, validateCanvasDimensions, calculateDrawingBounds } from './src/domain/Drawing.js';

// Import application layer
import { saveJournalEntry, loadJournalEntries, getCurrentIntentText, saveCurrentIntentText, clearCurrentIntentText } from './src/application/JournalService.js';
import { getRoutine, getFlatExerciseArray, getCurrentExerciseIndex, setCurrentExerciseIndex, getNextExerciseIndex, moveToNextExercise, resetExerciseCycle, getCurrentExerciseInfo, getExerciseProgress, getCurrentExerciseTiming, isExerciseCycleComplete, getExerciseStatistics } from './src/application/ExerciseService.js';
import { loadBookText, getStoredBookText, setStoredBookText, getCurrentReadingPointer, setCurrentReadingPointer, getCurrentReadingWPM, setCurrentReadingWPM, getReadingProgress, getCurrentReadingChunk, moveToNextReadingChunk, getReadingStatistics, calculateReadingSessionTiming, splitTextForRSVP } from './src/application/ReadingService.js';
import { initializeDrawingCanvas, startDrawingStroke, continueDrawingStroke, stopDrawingStroke, saveCanvasState, undoDrawingAction, redoDrawingAction, clearCanvas, adjustCanvasZoom, saveCanvasAsImage, copyCanvasToClipboard } from './src/application/DrawingService.js';

// Import infrastructure layer
import { setItem, getItem, removeItem, clearStorage, getJournalEntries, saveJournalEntries, addJournalEntry, getCurrentIntent, saveCurrentIntent, clearCurrentIntent, getExerciseIndex, setExerciseIndex, getReadingPointer, setReadingPointer, getReadingWPM, setReadingWPM, getBookMeta, setBookMeta } from './src/infrastructure/Storage.js';
import { playBeep, playSuccessBeep, playErrorBeep, playExerciseCompleteBeep, playPrayerCompleteBeep, playReadingCompleteBeep, isAudioSupported, createAudioContext, resumeAudioContext } from './src/infrastructure/Audio.js';
import { showElement, hideElement, updateTextContent, updateInnerHTML, addClass, removeClass, toggleClass, createElement, getElementById, querySelector, querySelectorAll, addEventListener, removeEventListener, focusElement, blurElement, scrollIntoView, getBoundingRect } from './src/infrastructure/UI.js';

// Import presentation layer
import { initializeJournal } from './src/presentation/JournalController.js';
import { initializeExercise, renderCurrentExercise } from './src/presentation/ExerciseController.js';
import { initializeReading } from './src/presentation/ReadingController.js';
import { initializeDrawing } from './src/presentation/DrawingController.js';
import { initializeKeyboardShortcuts } from './src/presentation/KeyboardController.js';

// Import shared utilities
import { clamp, debounce, throttle, formatTimestamp, parseUrl, extractDomain, isWordChar, findNextWordIndex, findPrevWordIndex, isSentencePunct, getTokenBefore, looksLikeSentenceBoundary, findNextSentenceIndex, findPrevSentenceIndex } from './src/shared/Utils.js';
import { STORAGE_KEYS, DEFAULT_SETTINGS, KEYBOARD_SHORTCUTS, EXERCISE_ROUTINE, AUDIO_CONFIG, UI_CONFIG, CANVAS_CONFIG } from './src/shared/Constants.js';

/**
 * Main application initialization
 */
(function() {
  // Get URL parameters
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  
  // Initialize all modules
  initializeJournal(from);
  initializeExercise();
  initializeReading();
  initializeDrawing();
  initializeKeyboardShortcuts();
  
  // Initialize prayer functionality
  initializePrayer();
  
  // Make doodle modal globally accessible
  window.showDoodleModal = () => {
    const doodleBtn = getElementById('doodleBtn');
    if (doodleBtn) {
      doodleBtn.click();
    }
  };
  
  // Initialize exercise rendering
  window.renderExercise = renderCurrentExercise;
  renderCurrentExercise();
})();

/**
 * Initialize prayer functionality
 */
function initializePrayer() {
  const prayBtn = getElementById('prayBtn');
  if (!prayBtn) return;
  
  const controller = createHoverCancelController(prayBtn, prayBtn.textContent || '1‑min prayer');
  let seconds = 60;
  let timer = null;
  
  function start() {
    if (timer) clearInterval(timer);
    seconds = 60;
    controller.setRunning(true);
    controller.start();
    controller.setLabel('60s');
    
    timer = setInterval(() => {
      seconds -= 1;
      if (!controller.isHover()) {
        controller.setLabel(`${String(seconds % 60).padStart(2, '0')}s`);
      }
      if (seconds <= 0) {
        clearInterval(timer);
        timer = null;
        controller.stop();
        playPrayerCompleteBeep();
      }
    }, 1000);
    
    playBeep(800, 160);
  }
  
  function cancel() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    controller.stop();
  }
  
  addEventListener(prayBtn, 'click', () => {
    if (controller.isRunning()) {
      cancel();
    } else {
      start();
    }
  });
}

/**
 * Create hover cancel controller for buttons
 * @param {HTMLElement} button - Button element
 * @param {string} defaultLabel - Default button label
 * @returns {Object} Controller object
 */
function createHoverCancelController(button, defaultLabel) {
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
