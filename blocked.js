/**
 * Main application entry point
 * Orchestrates all modules using clean architecture
 */

console.log('Blocked.js starting to load...');

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
import { initializeReading, cancelReading } from './src/presentation/ReadingController.js';
import { initializeDrawing, resetDrawingState } from './src/presentation/DrawingController.js';
import { initializeEyeHealth, showEyeHealthModal, hideEyeHealthModal } from './src/presentation/EyeHealthController.js';
import { initializeMind, showMindModal, hideMindModal } from './src/presentation/MindController.js';
import { initializeChinese, getChineseModal, isChineseModalOpen, resetChineseModal } from './src/presentation/ChineseController.js';
import { initializeMirror, resetMirrorModal } from './src/presentation/MirrorController.js';
import { initializeKeyboardShortcuts } from './src/presentation/KeyboardController.js';
import { initializeShortcutsModal, setupShortcutsButtons, showShortcutsModal } from './src/presentation/ShortcutsController.js';

// Import shared utilities
import { clamp, debounce, throttle, formatTimestamp, parseUrl, extractDomain, isWordChar, findNextWordIndex, findPrevWordIndex, isSentencePunct, getTokenBefore, looksLikeSentenceBoundary, findNextSentenceIndex, findPrevSentenceIndex } from './src/shared/Utils.js';
import { STORAGE_KEYS, DEFAULT_SETTINGS, KEYBOARD_SHORTCUTS, EXERCISE_ROUTINE, AUDIO_CONFIG, UI_CONFIG, CANVAS_CONFIG } from './src/shared/Constants.js';

console.log('All imports loaded successfully');

/**
 * Main application initialization
 */
(function() {
  console.log('Starting main application initialization...');
  
  // Get URL parameters
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  console.log('URL parameters loaded, from:', from);
  
  try {
    // Initialize all modules
    console.log('Initializing journal...');
    initializeJournal(from);
    console.log('Journal initialized');
    
    console.log('Initializing exercise...');
    initializeExercise();
    console.log('Exercise initialized');
    
    console.log('Initializing reading...');
    initializeReading();
    console.log('Reading initialized');
    
    console.log('Initializing drawing...');
    initializeDrawing();
    console.log('Drawing initialized');
    
    console.log('Initializing eye health...');
    initializeEyeHealth();
    console.log('Eye health initialized');
    
    console.log('Initializing mind exercises...');
    initializeMind();
    console.log('Mind exercises initialized');
    
    console.log('Initializing Chinese learning...');
    initializeChinese();
    console.log('Chinese learning initialized');
    
    console.log('Initializing mirror...');
    initializeMirror();
    console.log('Mirror initialized');
    
    console.log('Initializing keyboard shortcuts...');
    initializeKeyboardShortcuts();
    console.log('Keyboard shortcuts initialized');
    
    console.log('Initializing shortcuts modal...');
    initializeShortcutsModal();
    setupShortcutsButtons();
    console.log('Shortcuts modal initialized');
    
    // Initialize prayer functionality
    console.log('Initializing prayer...');
    initializePrayer();
    console.log('Prayer initialized');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
  
  // Make doodle modal globally accessible
  window.showDoodleModal = () => {
    console.log('showDoodleModal called');
    const doodleBtn = getElementById('doodleBtn');
    console.log('doodleBtn found:', !!doodleBtn);
    if (doodleBtn) {
      doodleBtn.click();
    }
  };
  
  // Make eye health modal globally accessible
  window.showEyeHealthModal = () => {
    console.log('showEyeHealthModal called');
    showEyeHealthModal();
  };
  
  // Make mind modal globally accessible
  window.showMindModal = () => {
    console.log('showMindModal called');
    showMindModal();
  };
  
  // Make Chinese modal globally accessible
  window.showChineseModal = () => {
    console.log('showChineseModal called');
    const chineseBtn = getElementById('chineseBtn');
    if (chineseBtn) {
      chineseBtn.click();
    }
  };
  
  // Make shortcuts modal globally accessible (assign early)
  window.showShortcutsModal = showShortcutsModal;
  console.log('showShortcutsModal assigned to window:', typeof window.showShortcutsModal);
  
  // Make modal close handlers globally accessible
  window.hideReadingModal = () => {
    const modal = getElementById('readModal');
    if (modal) {
      removeClass(modal, 'show');
      modal.setAttribute('aria-hidden', 'true');
    }
    cancelReading();
  };
  
  window.hideDrawingModal = () => {
    const modal = getElementById('doodleModal');
    if (modal) {
      removeClass(modal, 'show');
      modal.setAttribute('aria-hidden', 'true');
    }
    resetDrawingState();
  };
  
  window.hideEyeHealthModal = hideEyeHealthModal;
  window.hideMindModal = hideMindModal;
  
  window.hideChineseModal = () => {
    const modal = getElementById('chineseModal');
    if (modal) {
      removeClass(modal, 'show');
      modal.setAttribute('aria-hidden', 'true');
    }
    resetChineseModal();
  };
  
  window.hideMirrorModal = () => {
    const modal = getElementById('mirrorModal');
    if (modal) {
      removeClass(modal, 'show');
      modal.setAttribute('aria-hidden', 'true');
    }
    resetMirrorModal();
  };
  
  // Initialize exercise rendering
  window.renderExercise = renderCurrentExercise;
  renderCurrentExercise();
})();

/**
 * Initialize prayer functionality
 */
function initializePrayer() {
  console.log('initializePrayer called');
  const prayBtn = getElementById('prayBtn');
  console.log('prayBtn found:', !!prayBtn);
  if (!prayBtn) return;
  
  const controller = createHoverCancelController(prayBtn, prayBtn.textContent || '1‑min prayer');
  let seconds = 60;
  let timer = null;
  
  function start() {
    console.log('Prayer start function called');
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
        console.log('Prayer complete, playing beep');
        playPrayerCompleteBeep();
      }
    }, 1000);
    
    console.log('Playing start beep');
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
    console.log('Prayer button clicked, isRunning:', controller.isRunning());
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
