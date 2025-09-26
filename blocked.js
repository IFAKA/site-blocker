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
import { handleModalKeydown } from './src/presentation/ModalManager.js';

// Import shared utilities
import { clamp, debounce, throttle, formatTimestamp, parseUrl, extractDomain, isWordChar, findNextWordIndex, findPrevWordIndex, isSentencePunct, getTokenBefore, looksLikeSentenceBoundary, findNextSentenceIndex, findPrevSentenceIndex } from './src/shared/Utils.js';
import { STORAGE_KEYS, DEFAULT_SETTINGS, KEYBOARD_SHORTCUTS, EXERCISE_ROUTINE, AUDIO_CONFIG, UI_CONFIG, CANVAS_CONFIG } from './src/shared/Constants.js';

console.log('All imports loaded successfully');

// Global state management
let currentActiveModal = null;
let currentActiveModalId = null;
let currentActiveModalElement = null;
let currentActiveModalController = null;
let globalShortcutsEnabled = true;
let isTypingContext = false;

// Gallery state management
let galleryFocused = false;
let selectedItems = new Set();
window.selectedItems = selectedItems; // Make it globally accessible

/**
 * Update the global selectedItems reference
 */
function updateGlobalSelectedItems() {
  window.selectedItems = selectedItems;
}
let galleryGroups = [];
let galleryItems = [];

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
    
    console.log('Initializing progress visualization...');
    initializeProgressVisualization();
    console.log('Progress visualization initialized');
    
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
  
  // Make progress chart functions globally accessible
  window.updateMindProgressChart = updateMindProgressChart;
  window.updateEyeHealthProgressChart = updateEyeHealthProgressChart;
  window.updateChineseProgressChart = updateChineseProgressChart;
  window.updatePrayerProgressChart = updatePrayerProgressChart;
  window.updateReadingProgressChart = updateReadingProgressChart;
  window.updateDoodleGallery = updateDoodleGallery;
  window.focusGallery = focusGallery;
  window.showGalleryModal = showGalleryModal;
  window.hideGalleryModal = hideGalleryModal;
  
  // Setup gallery event listeners
  setupGalleryEventListeners();
  
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
  
  // Make doodle modal functions globally accessible
  window.hideDoodleModal = hideDoodleModal;
  
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
        
        // Save prayer statistics
        savePrayerStatistics();
        
        // Update progress chart
        if (window.updatePrayerProgressChart) {
          window.updatePrayerProgressChart();
        }
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

/**
 * Initialize progress visualization for all activities
 */
function initializeProgressVisualization() {
  console.log('Initializing progress visualization...');
  
  // Check prayer streak first
  checkPrayerStreak();
  
  // Update all progress charts
  updateMindProgressChart();
  updateEyeHealthProgressChart();
  updateChineseProgressChart();
  updatePrayerProgressChart();
  updateReadingProgressChart();
  updateDoodleGallery();
  
  // Set up periodic updates
  setInterval(() => {
    updateMindProgressChart();
    updateEyeHealthProgressChart();
    updateChineseProgressChart();
    updatePrayerProgressChart();
    updateReadingProgressChart();
    updateDoodleGallery();
  }, 30000); // Update every 30 seconds
}

/**
 * Update Mind Exercises progress chart
 */
function updateMindProgressChart() {
  try {
    const stats = getItem('site-blocker:mind:statistics');
    if (!stats) return;
    
    const data = JSON.parse(stats);
    const sessions = data.sessions || [];
    
    // Update session count
    const sessionsCountEl = getElementById('mindSessionsCount');
    if (sessionsCountEl) {
      updateTextContent(sessionsCountEl, `${sessions.length} sessions`);
    }
    
    // Update summary
    const bestScoreEl = getElementById('mindBestScore');
    const avgScoreEl = getElementById('mindAvgScore');
    if (bestScoreEl) updateTextContent(bestScoreEl, `Best: ${data.bestScore || 0}`);
    if (avgScoreEl) updateTextContent(avgScoreEl, `Avg: ${data.averageScore || 0}`);
    
    // Render chart if we have data
    if (sessions.length > 0) {
      renderProgressChart('mindProgressChart', sessions.map(s => s.score), '#10b981');
    }
  } catch (error) {
    console.warn('Failed to update mind progress chart:', error);
  }
}

/**
 * Update Eye Health progress chart
 */
function updateEyeHealthProgressChart() {
  try {
    const stats = getItem('site-blocker:eye:statistics');
    if (!stats) return;
    
    const data = JSON.parse(stats);
    const sessions = data.sessions || [];
    
    // Update session count
    const sessionsCountEl = getElementById('eyeSessionsCount');
    if (sessionsCountEl) {
      updateTextContent(sessionsCountEl, `${sessions.length} sessions`);
    }
    
    // Calculate total time and streak
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalMinutes = Math.floor(totalTime / 60000);
    
    // Update summary
    const totalTimeEl = getElementById('eyeTotalTime');
    const streakEl = getElementById('eyeStreak');
    if (totalTimeEl) updateTextContent(totalTimeEl, `Total: ${totalMinutes}min`);
    if (streakEl) updateTextContent(streakEl, `Streak: ${data.streak || 0}`);
    
    // Render chart if we have data
    if (sessions.length > 0) {
      renderProgressChart('eyeProgressChart', sessions.map(s => Math.floor(s.duration / 1000)), '#3b82f6');
    }
  } catch (error) {
    console.warn('Failed to update eye health progress chart:', error);
  }
}

/**
 * Update Chinese Learning progress chart
 */
function updateChineseProgressChart() {
  try {
    const stats = getItem('site-blocker:chinese:statistics');
    if (!stats) return;
    
    const data = JSON.parse(stats);
    const sessions = data.sessions || [];
    
    // Update session count
    const sessionsCountEl = getElementById('chineseSessionsCount');
    if (sessionsCountEl) {
      updateTextContent(sessionsCountEl, `${sessions.length} sessions`);
    }
    
    // Update summary
    const wordsLearnedEl = getElementById('chineseWordsLearned');
    const accuracyEl = getElementById('chineseAccuracy');
    if (wordsLearnedEl) updateTextContent(wordsLearnedEl, `Words: ${data.wordsLearned || 0}`);
    if (accuracyEl) updateTextContent(accuracyEl, `Accuracy: ${Math.round(data.averageAccuracy || 0)}%`);
    
    // Render chart if we have data
    if (sessions.length > 0) {
      renderProgressChart('chineseProgressChart', sessions.map(s => s.wordsLearned || 0), '#f59e0b');
    }
  } catch (error) {
    console.warn('Failed to update Chinese progress chart:', error);
  }
}

/**
 * Update Prayer progress chart
 */
function updatePrayerProgressChart() {
  try {
    const stats = getItem('site-blocker:prayer:statistics');
    if (!stats) return;
    
    const data = JSON.parse(stats);
    const sessions = data.sessions || [];
    
    // Update session count
    const sessionsCountEl = getElementById('prayerSessionsCount');
    if (sessionsCountEl) {
      updateTextContent(sessionsCountEl, `${sessions.length} sessions`);
    }
    
    // Calculate total time and streak
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalMinutes = Math.floor(totalTime / 60000);
    
    // Update summary
    const totalTimeEl = getElementById('prayerTotalTime');
    const streakEl = getElementById('prayerStreak');
    if (totalTimeEl) updateTextContent(totalTimeEl, `Total: ${totalMinutes}min`);
    if (streakEl) updateTextContent(streakEl, `Streak: ${data.streak || 0}`);
    
    // Render chart if we have data
    if (sessions.length > 0) {
      renderProgressChart('prayerProgressChart', sessions.map(s => Math.floor(s.duration / 1000)), '#8b5cf6');
    }
  } catch (error) {
    console.warn('Failed to update prayer progress chart:', error);
  }
}

/**
 * Check and update prayer streak on app load
 */
function checkPrayerStreak() {
  try {
    const existingStats = getItem('site-blocker:prayer:statistics');
    if (!existingStats) return;
    
    const statistics = JSON.parse(existingStats);
    const today = new Date().toDateString();
    
    // Get all unique days when prayers were completed
    const prayerDays = [...new Set(statistics.sessions.map(s => 
      new Date(s.date).toDateString()
    ))].sort();
    
    if (prayerDays.length === 0) {
      statistics.currentStreak = 0;
    } else {
      // Calculate consecutive days from the most recent prayer day
      let consecutiveDays = 1;
      const mostRecentDay = new Date(prayerDays[prayerDays.length - 1]);
      const todayDate = new Date(today);
      
      // Check if the most recent prayer was today or yesterday
      const daysDiff = Math.floor((todayDate - mostRecentDay) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Most recent prayer was today, continue counting backwards
        let checkDate = new Date(mostRecentDay);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (prayerDays.includes(checkDate.toDateString())) {
          consecutiveDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else if (daysDiff === 1) {
        // Most recent prayer was yesterday, continue counting backwards
        let checkDate = new Date(mostRecentDay);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (prayerDays.includes(checkDate.toDateString())) {
          consecutiveDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else {
        // Gap of more than 1 day, streak is broken
        consecutiveDays = 0;
      }
      
      statistics.currentStreak = consecutiveDays;
    }
    
    setItem('site-blocker:prayer:statistics', JSON.stringify(statistics));
    console.log('Prayer streak updated:', statistics.currentStreak);
  } catch (error) {
    console.warn('Failed to check prayer streak:', error);
  }
}

/**
 * Save prayer statistics
 */
function savePrayerStatistics() {
  try {
    const existingStats = getItem('site-blocker:prayer:statistics');
    let statistics = existingStats ? JSON.parse(existingStats) : {
      totalSessions: 0,
      totalTime: 0,
      averageTime: 0,
      bestStreak: 0,
      currentStreak: 0,
      sessions: []
    };
    
    // Add new session
    const sessionData = {
      date: new Date().toISOString(),
      duration: 60000, // 1 minute in milliseconds
      completed: true
    };
    
    statistics.sessions.push(sessionData);
    statistics.totalSessions += 1;
    statistics.totalTime += sessionData.duration;
    statistics.averageTime = Math.round(statistics.totalTime / statistics.totalSessions);
    
    // Calculate streak - proper daily streak tracking
    const today = new Date().toDateString();
    
    // Get all unique days when prayers were completed, sorted by date
    const prayerDays = [...new Set(statistics.sessions.map(s => 
      new Date(s.date).toDateString()
    ))].sort();
    
    if (prayerDays.length === 0) {
      statistics.currentStreak = 1;
    } else {
      // Calculate consecutive days from the most recent prayer day
      let consecutiveDays = 1;
      const mostRecentDay = new Date(prayerDays[prayerDays.length - 1]);
      const todayDate = new Date(today);
      
      // Check if the most recent prayer was today or yesterday
      const daysDiff = Math.floor((todayDate - mostRecentDay) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Most recent prayer was today, continue counting backwards
        let checkDate = new Date(mostRecentDay);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (prayerDays.includes(checkDate.toDateString())) {
          consecutiveDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else if (daysDiff === 1) {
        // Most recent prayer was yesterday, continue counting backwards
        let checkDate = new Date(mostRecentDay);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (prayerDays.includes(checkDate.toDateString())) {
          consecutiveDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else {
        // Gap of more than 1 day, streak is broken
        consecutiveDays = 1;
      }
      
      statistics.currentStreak = consecutiveDays;
    }
    
    statistics.bestStreak = Math.max(statistics.bestStreak, statistics.currentStreak);
    
    // Keep only last 50 sessions
    if (statistics.sessions.length > 50) {
      statistics.sessions = statistics.sessions.slice(-50);
    }
    
    setItem('site-blocker:prayer:statistics', JSON.stringify(statistics));
    console.log('Prayer statistics saved:', statistics);
  } catch (error) {
    console.warn('Failed to save prayer statistics:', error);
  }
}

/**
 * Update Reading progress chart
 */
function updateReadingProgressChart() {
  try {
    const stats = getItem('site-blocker:reading:statistics');
    if (!stats) return;
    
    const data = JSON.parse(stats);
    const sessions = data.sessions || [];
    
    // Update session count
    const sessionsCountEl = getElementById('readingSessionsCount');
    if (sessionsCountEl) {
      updateTextContent(sessionsCountEl, `${sessions.length} sessions`);
    }
    
    // Update summary
    const wordsReadEl = getElementById('readingWordsRead');
    const wpmEl = getElementById('readingWPM');
    if (wordsReadEl) updateTextContent(wordsReadEl, `Words: ${data.totalWords || 0}`);
    if (wpmEl) updateTextContent(wpmEl, `WPM: ${data.averageWPM || 0}`);
    
    // Render chart if we have data
    if (sessions.length > 0) {
      renderProgressChart('readingProgressChart', sessions.map(s => s.wordsRead || 0), '#06b6d4');
    }
  } catch (error) {
    console.warn('Failed to update reading progress chart:', error);
  }
}

/**
 * Update Doodle Gallery Preview
 */
function updateDoodleGallery() {
  try {
    const doodlesData = getItem('site-blocker:doodles');
    
    let doodles;
    if (!doodlesData) {
      doodles = [];
    } else if (typeof doodlesData === 'string') {
      doodles = JSON.parse(doodlesData);
    } else if (Array.isArray(doodlesData)) {
      doodles = doodlesData;
    } else {
      console.warn('Invalid doodles data format, resetting to empty array');
      doodles = [];
    }
    
    const countEl = getElementById('doodleCount');
    const previewGrid = getElementById('doodleGalleryPreviewGrid');
    
    // Update count
    if (countEl) {
      updateTextContent(countEl, `${doodles.length} doodles`);
    }
    
    if (!previewGrid) return;
    
    // Clear existing content
    previewGrid.innerHTML = '';
    
    if (doodles.length === 0) {
      // Show placeholder
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        color: #64748b;
        font-size: 1rem;
        flex-direction: column;
        gap: 8px;
      `;
      placeholder.innerHTML = `
        <div style="font-size: 2rem;">🎨</div>
        <div>Create doodles to see them here</div>
        <div style="font-size: 0.8rem; color: #64748b;">Use the Doodle tool (D key) to start creating</div>
      `;
      previewGrid.appendChild(placeholder);
      return;
    }
    
    // Show 4 random doodles
    const shuffledDoodles = shuffleArray([...doodles]).slice(0, 4);
    
    shuffledDoodles.forEach((doodle, index) => {
      const previewItem = document.createElement('div');
      previewItem.style.cssText = `
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #334155;
        background: #0f172a;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      const img = document.createElement('img');
      img.src = doodle.imageData;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
      `;
      
      previewItem.appendChild(img);
      previewGrid.appendChild(previewItem);
    });
    
  } catch (error) {
    console.warn('Failed to update doodle gallery preview:', error);
  }
}

/**
 * Show Gallery Modal
 */
function showGalleryModal() {
  const modal = getElementById('galleryModal');
  if (!modal) return;
  
  addClass(modal, 'show');
  // Remove aria-hidden when modal is shown to allow focus
  modal.removeAttribute('aria-hidden');
  
  // Update the full gallery in the modal
  updateFullGallery();
  
  // Rebuild navigation system after gallery update
  buildNavigationItems();
  
  // Ensure click handlers are properly attached
  addGalleryItemClickHandlers();
  setupGalleryDragAndDrop();
  
  // Setup keyboard shortcuts
  setupGalleryKeyboardShortcuts();
  
  // Auto-focus first element when modal opens
  setTimeout(() => {
    if (galleryNavigationItems.length > 0) {
      // Calculate optimal grid layout
      calculateOptimalGridLayout();
      // Sync cursor index with new navigation array
      syncCursorIndex();
      updateGalleryCursor();
    }
  }, 100);
}

/**
 * Hide Gallery Modal
 */
function hideGalleryModal() {
  const modal = getElementById('galleryModal');
  if (!modal) return;
  
  removeClass(modal, 'show');
  modal.setAttribute('aria-hidden', 'true');
  
  // Exit gallery focus if active
  if (galleryFocused) {
    exitGalleryFocus();
  }
  
  // Remove gallery keyboard shortcuts
  removeGalleryKeyboardShortcuts();
}

/**
 * Setup gallery event listeners
 */
function setupGalleryEventListeners() {
  // Gallery preview click to open modal
  const galleryPreview = getElementById('doodleGalleryPreview');
  if (galleryPreview) {
    addEventListener(galleryPreview, 'click', () => {
      showGalleryModal();
    });
  }
  
  // Gallery modal close button
  const galleryClose = getElementById('galleryClose');
  if (galleryClose) {
    addEventListener(galleryClose, 'click', () => {
      hideGalleryModal();
    });
  }
  
  // Delete confirmation modal event listeners
  const deleteConfirmClose = getElementById('deleteConfirmClose');
  const deleteConfirmNo = getElementById('deleteConfirmNo');
  const deleteConfirmYes = getElementById('deleteConfirmYes');
  
  if (deleteConfirmClose) {
    addEventListener(deleteConfirmClose, 'click', hideDeleteConfirmation);
  }
  
  if (deleteConfirmNo) {
    addEventListener(deleteConfirmNo, 'click', hideDeleteConfirmation);
  }
  
  if (deleteConfirmYes) {
    addEventListener(deleteConfirmYes, 'click', confirmDelete);
  }
}

/**
 * Update Full Gallery in Modal
 */
function updateFullGallery() {
  try {
    const doodlesData = getItem('site-blocker:doodles');
    
    let doodles;
    if (!doodlesData) {
      doodles = [];
    } else if (typeof doodlesData === 'string') {
      doodles = JSON.parse(doodlesData);
    } else if (Array.isArray(doodlesData)) {
      doodles = doodlesData;
    } else {
      console.warn('Invalid doodles data format, resetting to empty array');
      doodles = [];
    }
    
    const galleryEl = getElementById('doodleGallery');
    
    if (!galleryEl) return;
    
    // Clear existing content
    galleryEl.innerHTML = '';
    galleryItems = [];
    
    if (doodles.length === 0) {
      // Show placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'gallery-placeholder';
      placeholder.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        color: #64748b;
        font-size: 1rem;
        width: 100%;
        flex-direction: column;
        gap: 8px;
      `;
      placeholder.innerHTML = `
        <div style="font-size: 2rem;">🎨</div>
        <div>Create doodles to see them here</div>
        <div style="font-size: 0.8rem; color: #64748b;">Use the Doodle tool (D key) to start creating</div>
      `;
      galleryEl.appendChild(placeholder);
      return;
    }
    
    // Load groups from storage
    loadGalleryGroups();
    
    // Render gallery items
    renderGalleryItems(doodles);
    
    // Setup gallery interactions
    setupGalleryInteractions();
    
  } catch (error) {
    console.warn('Failed to update full gallery:', error);
  }
}

/**
 * Load gallery groups from storage
 */
function loadGalleryGroups() {
  try {
    galleryGroups = getItem('site-blocker:gallery:groups') || [];
  } catch (error) {
    console.warn('Failed to load gallery groups:', error);
    galleryGroups = [];
  }
}

/**
 * Save gallery groups to storage
 */
function saveGalleryGroups() {
  try {
    setItem('site-blocker:gallery:groups', galleryGroups);
  } catch (error) {
    console.warn('Failed to save gallery groups:', error);
  }
}

/**
 * Render gallery items with groups
 */
function renderGalleryItems(doodles) {
  const galleryEl = getElementById('doodleGallery');
  
  // Clear existing content
  galleryEl.innerHTML = '';
  
  // Reset galleryItems array
  galleryItems = [];
  
  // Create groups first
  galleryGroups.forEach((group, groupIndex) => {
    const groupEl = createGroupElement(group, groupIndex);
    galleryEl.appendChild(groupEl);
  });
  
  // Add ungrouped items
  const ungroupedItems = doodles.filter(doodle => !galleryGroups.some(group => 
    group.items.some(item => item.id === doodle.id)
  ));
  
  ungroupedItems.forEach((doodle, index) => {
    const itemEl = createGalleryItem(doodle, index);
    galleryEl.appendChild(itemEl);
    galleryItems.push(itemEl); // Add to galleryItems array
  });
  
  // Setup click handlers after items are rendered
  addGalleryItemClickHandlers();
  
  // Setup drag and drop after items are rendered
  setupGalleryDragAndDrop();
  
  // Build navigation items after items are rendered
  buildNavigationItems();
}

/**
 * Create group element
 */
function createGroupElement(group, groupIndex) {
  const groupEl = document.createElement('div');
  groupEl.className = 'gallery-group';
  groupEl.dataset.groupId = group.id;
  groupEl.dataset.groupIndex = groupIndex;
  
  // Create group preview (single item representing the group)
  const preview = document.createElement('div');
  preview.className = 'gallery-group-preview';
  preview.style.cssText = `
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    position: relative;
  `;
  
  // Show group icon and count with responsive sizing
  preview.innerHTML = `
    <div style="font-size: var(--icon-size); margin-bottom: 2px;">📁</div>
    <div style="font-size: var(--text-size);">${group.items.length}</div>
  `;
  
  // Add group name as tooltip
  preview.title = `${group.name} (${group.items.length} items)`;
  
  groupEl.appendChild(preview);
  
  // Add group interactions
  groupEl.addEventListener('click', (e) => {
    if (e.target === groupEl || e.target === preview) {
      // Enter group instead of selecting it
      enterGroup(groupIndex);
    }
  });
  
  // Add right-click for selection
  groupEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    toggleGroupSelection(groupIndex);
  });
  
  return groupEl;
}

/**
 * Create gallery item element
 */
function createGalleryItem(doodle, index, groupIndex = null) {
  const itemEl = document.createElement('div');
  itemEl.className = 'gallery-item';
  itemEl.dataset.itemId = doodle.id;
  itemEl.dataset.itemIndex = index;
  if (groupIndex !== null) {
    itemEl.dataset.groupIndex = groupIndex;
  }
  
  const thumbnail = document.createElement('img');
  thumbnail.className = 'gallery-thumbnail doodle-thumbnail';
  thumbnail.src = doodle.imageData;
  thumbnail.alt = `Doodle ${index + 1}`;
  thumbnail.title = `Created: ${new Date(doodle.timestamp).toLocaleDateString()}`;
  thumbnail.draggable = true;
  
  itemEl.appendChild(thumbnail);
  galleryItems.push(itemEl);
  
  return itemEl;
}

/**
 * Setup gallery interactions
 */
function setupGalleryInteractions() {
  // Setup keyboard shortcuts
  setupGalleryKeyboardShortcuts();
  
  // Setup click handlers (only if items exist)
  if (galleryItems.length > 0) {
    addGalleryItemClickHandlers();
  }
}

// Gallery navigation state
let currentFocusIndex = -1;
let currentGroupIndex = -1; // -1 means not in a group
window.currentGroupIndex = currentGroupIndex; // Make it globally accessible
let galleryNavigationItems = [];

// Gallery keyboard event listener reference
let galleryKeyboardListener = null;

/**
 * Calculate optimal grid layout for responsive gallery
 */
function calculateOptimalGridLayout() {
  const container = document.getElementById('doodleGallery');
  if (!container) return;
  
  const itemCount = galleryNavigationItems.length;
  if (itemCount === 0) return;
  
  const containerRect = container.getBoundingClientRect();
  const containerPadding = 16; // CSS padding value
  const gap = 8; // CSS gap value
  const usableWidth = containerRect.width - (containerPadding * 2);
  const usableHeight = containerRect.height - (containerPadding * 2);
  
  // Calculate optimal grid dimensions based on item count
  const aspectRatio = usableWidth / usableHeight;
  const totalArea = usableWidth * usableHeight;
  const itemArea = totalArea / itemCount;
  const itemSize = Math.sqrt(itemArea);
  
  // Apply constraints
  const minSize = 40; // Minimum size for visibility
  const maxSize = 120; // Maximum size to prevent too large items
  const optimalSize = Math.max(minSize, Math.min(maxSize, itemSize));
  
  // Calculate how many items fit with optimal size
  const itemsPerRow = Math.floor((usableWidth + gap) / (optimalSize + gap));
  const rows = Math.ceil(itemCount / itemsPerRow);
  
  // Calculate responsive font sizes based on item size
  const iconSize = Math.max(12, Math.min(20, optimalSize * 0.3));
  const textSize = Math.max(8, Math.min(12, optimalSize * 0.2));
  
  // Update CSS custom properties for dynamic sizing
  container.style.setProperty('--item-size', `${optimalSize}px`);
  container.style.setProperty('--items-per-row', itemsPerRow);
  container.style.setProperty('--icon-size', `${iconSize}px`);
  container.style.setProperty('--text-size', `${textSize}px`);
  
  return { itemsPerRow, optimalSize, rows };
}

/**
 * Recalculate grid dimensions when layout changes
 */
function recalculateGridDimensions() {
  calculateOptimalGridLayout();
}

/**
 * Setup gallery keyboard shortcuts
 */
function setupGalleryKeyboardShortcuts() {
  // Remove existing listener if it exists
  if (galleryKeyboardListener) {
    document.removeEventListener('keydown', galleryKeyboardListener);
  }
  
  // Create new listener function
  galleryKeyboardListener = (e) => {
    // Check if delete confirmation modal is open
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal && deleteModal.classList.contains('show')) {
      const key = e.key.toLowerCase();
      if (key === 'y') {
        e.preventDefault();
        confirmDelete();
      } else if (key === 'n') {
        e.preventDefault();
        hideDeleteConfirmation();
      } else if (key === 'escape' || key === 'q') {
        e.preventDefault();
        hideDeleteConfirmation();
      }
      return;
    }
    
    // Only work when gallery modal is open
    const modal = document.getElementById('galleryModal');
    if (!modal || !modal.classList.contains('show')) return;
    
    // Handle ESC/Q for doodle modal - go back to gallery instead of closing modal
    const doodleModal = document.getElementById('doodleViewModal');
    if (doodleModal && doodleModal.classList.contains('show')) {
      const key = e.key.toLowerCase();
      if (key === 'escape' || key === 'q') {
        e.preventDefault();
        hideDoodleModal();
        return;
      }
      return;
    }
    
    // Check if user is typing in an input field
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.contentEditable === 'true'
    );
    
    // Don't handle keyboard events if group input is active
    if (activeElement && activeElement.tagName === 'INPUT' && activeElement.placeholder === 'Enter group name...') {
      return;
    }
    
    // If typing, only allow Escape and Enter
    if (isTyping) {
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        e.preventDefault();
        if (activeElement.blur) activeElement.blur();
        return;
      }
      if (key === 'enter') {
        // Let Enter work normally for form submission
        return;
      }
      // Block all other keys when typing
      e.preventDefault();
      return;
    }
    
    const key = e.key.toLowerCase();
    
    // Let '?' key pass through to global handler for context-aware shortcuts
    if (key === '?') {
      return; // Don't prevent default, let global handler determine context
    }
    
    
    switch (key) {
      case 'g':
        e.preventDefault();
        createGroupFromSelected();
        break;
      case 'a':
        e.preventDefault();
        selectAllItems();
        break;
      case 'u':
        e.preventDefault();
        ungroupSelected();
        break;
      case 'd':
        e.preventDefault();
        deleteSelected();
        break;
      case 'escape':
        if (selectedItems.size > 0) {
          e.preventDefault();
          // Cancel selections if any items are selected
          selectedItems.clear();
          updateGlobalSelectedItems();
          clearAllSelections();
          updateSelectedCount();
        } else if (currentGroupIndex >= 0) {
          // If inside a group, go back instead of closing modal
          e.preventDefault();
          exitGroup();
        } else {
          // Let unified modal system handle ESC
          return;
        }
        break;
      case 'q':
        if (selectedItems.size > 0) {
          e.preventDefault();
          // Cancel selections if any items are selected
          selectedItems.clear();
          updateGlobalSelectedItems();
          clearAllSelections();
          updateSelectedCount();
        } else if (currentGroupIndex >= 0) {
          // If inside a group, go back instead of closing modal
          e.preventDefault();
          exitGroup();
        } else {
          // Let unified modal system handle Q
          return;
        }
        break;
      case 'h':
        e.preventDefault();
        navigateGallery(-2); // left
        break;
      case 'j':
        e.preventDefault();
        navigateGallery(1); // down
        break;
      case 'k':
        e.preventDefault();
        navigateGallery(-1); // up
        break;
      case 'l':
        e.preventDefault();
        navigateGallery(2); // right
        break;
      case '0':
        e.preventDefault();
        navigateToFirst();
        break;
      case '$':
        e.preventDefault();
        navigateToLast();
        break;
      case ' ':
        e.preventDefault();
        toggleCurrentSelection();
        break;
      case 'enter':
        e.preventDefault();
        if (currentFocusIndex >= 0 && currentFocusIndex < galleryNavigationItems.length) {
          const item = galleryNavigationItems[currentFocusIndex];
          if (item.type === 'doodle') {
            const doodle = getDoodleById(item.id);
            if (doodle) {
              showDoodleModal(doodle);
            }
          } else if (item.type === 'group') {
            enterGroup(item.groupIndex);
          }
        }
        break;
      case 'tab':
        e.preventDefault();
        navigateGallery(2); // right (or down if at end of row)
        break;
      case 'shift+tab':
        e.preventDefault();
        navigateGallery(-2); // left (or up if at start of row)
        break;
      case 'b':
        e.preventDefault();
        if (currentGroupIndex >= 0) {
          exitGroup();
        }
        break;
      case '>':
        e.preventDefault();
        moveCurrentItemRight();
        break;
      case '<':
        e.preventDefault();
        moveCurrentItemLeft();
        break;
      case 'm':
        e.preventDefault();
        moveCurrentItemToEnd();
        break;
      case 'M':
        e.preventDefault();
        moveCurrentItemToStart();
        break;
    }
  };
  
  // Add the event listener
  document.addEventListener('keydown', galleryKeyboardListener);
  
  // Add window resize listener for responsive grid
  window.addEventListener('resize', () => {
    // Recalculate optimal grid layout when window is resized
    calculateOptimalGridLayout();
  });
}

/**
 * Remove gallery keyboard shortcuts
 */
function removeGalleryKeyboardShortcuts() {
  if (galleryKeyboardListener) {
    document.removeEventListener('keydown', galleryKeyboardListener);
    galleryKeyboardListener = null;
  }
}

/**
 * Setup gallery drag and drop
 */
function setupGalleryDragAndDrop() {
  if (!galleryItems || galleryItems.length === 0) return;
  
  galleryItems.forEach(item => {
    const thumbnail = item.querySelector('.gallery-thumbnail');
    
    thumbnail.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.itemId);
      item.classList.add('dragging');
    });
    
    thumbnail.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
    
    thumbnail.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    thumbnail.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const targetId = item.dataset.itemId;
      
      if (draggedId !== targetId) {
        moveItemInGallery(draggedId, targetId);
      }
    });
  });
}

/**
 * Open gallery modal
 */
function focusGallery() {
  showGalleryModal();
}

/**
 * Update gallery cursor position
 */
function updateGalleryCursor() {
  // Ensure we have a valid focus index
  if (currentFocusIndex < 0 || currentFocusIndex >= galleryNavigationItems.length) {
    currentFocusIndex = Math.max(0, Math.min(currentFocusIndex, galleryNavigationItems.length - 1));
  }
  
  // If no navigation items, don't show cursor
  if (galleryNavigationItems.length === 0) {
    return;
  }
  
  // Remove all cursors (fastest way)
  const existingCursors = document.querySelectorAll('.gallery-cursor');
  for (let i = 0; i < existingCursors.length; i++) {
    existingCursors[i].classList.remove('gallery-cursor');
  }
  
  // Add cursor to current item
  if (currentFocusIndex >= 0 && currentFocusIndex < galleryNavigationItems.length) {
    const item = galleryNavigationItems[currentFocusIndex];
    if (item.element) {
      // Find the thumbnail element
      const thumbnail = item.element.querySelector('.gallery-thumbnail') || item.element.querySelector('.gallery-group-preview') || item.element;
      thumbnail.classList.add('gallery-cursor');
      
      // Scroll instantly
      item.element.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }
  
}



/**
 * Toggle item selection
 */
function toggleItemSelection(itemId) {
  if (selectedItems.has(itemId)) {
    selectedItems.delete(itemId);
  } else {
    selectedItems.add(itemId);
  }
  
  // Update global reference
  updateGlobalSelectedItems();
  
  // Find the item in the current gallery items (works for both main gallery and group view)
  const item = document.querySelector(`[data-item-id="${itemId}"]`);
  if (item) {
    const isSelected = selectedItems.has(itemId);
    item.classList.toggle('selected', isSelected);
  }
  
  // Update selection indices for all selected items
  updateSelectionIndices();
  updateSelectedCount();
}

/**
 * Sync cursor index with current navigation array
 */
function syncCursorIndex() {
  if (galleryNavigationItems.length === 0) {
    currentFocusIndex = -1;
    return;
  }
  
  // Ensure cursor index is within bounds
  if (currentFocusIndex < 0) {
    currentFocusIndex = 0;
  } else if (currentFocusIndex >= galleryNavigationItems.length) {
    currentFocusIndex = galleryNavigationItems.length - 1;
  }
  
  // If we're in a group and the current item is not in the group, reset to first item
  if (currentGroupIndex >= 0) {
    const currentItem = galleryNavigationItems[currentFocusIndex];
    if (!currentItem || currentItem.type !== 'doodle') {
      currentFocusIndex = 0;
    }
  }
}

/**
 * Update selection indices for all selected items
 */
function updateSelectionIndices() {
  const selectionArray = Array.from(selectedItems);
  
  // Update gallery items (if they exist)
  if (galleryItems && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      const itemId = item.dataset.itemId;
      
      if (selectedItems.has(itemId)) {
        const index = selectionArray.indexOf(itemId) + 1;
        item.classList.add('selected');
        item.setAttribute('data-selection-index', index.toString());
      } else {
        item.classList.remove('selected');
        item.removeAttribute('data-selection-index');
      }
    });
  }
  
  // Update groups
  document.querySelectorAll('.gallery-group').forEach(groupEl => {
    const groupIndex = groupEl.dataset.groupIndex;
    const groupId = `group-${groupIndex}`;
    
    if (selectedItems.has(groupId)) {
      const index = selectionArray.indexOf(groupId) + 1;
      groupEl.classList.add('selected');
      groupEl.setAttribute('data-selection-index', index.toString());
    } else {
      groupEl.classList.remove('selected');
      groupEl.removeAttribute('data-selection-index');
    }
  });
}

/**
 * Select all items
 */
function selectAllItems() {
  selectedItems.clear();
  updateGlobalSelectedItems();
  if (!galleryItems || galleryItems.length === 0) return;
  
  galleryItems.forEach((item, index) => {
    const itemId = item.dataset.itemId;
    
    selectedItems.add(itemId);
    item.classList.add('selected');
    item.setAttribute('data-selection-index', (index + 1).toString());
  });
  
  updateGlobalSelectedItems();
  updateSelectionIndices();
  updateSelectedCount();
}

/**
 * Create group from selected items
 */
function createGroupFromSelected() {
  if (selectedItems.size < 2) {
    alert('Please select at least 2 items to create a group');
    return;
  }
  
  // Create input field for group name
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter group name...';
  input.value = `Group ${galleryGroups.length + 1}`;
  input.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    background: #1e293b;
    color: #f1f5f9;
    outline: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    min-width: 300px;
  `;
  
  // Add backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
  `;
  
  document.body.appendChild(backdrop);
  document.body.appendChild(input);
  
  // Focus input and select text
  input.focus();
  input.select();
  
  // Handle input events
  const handleInput = (e) => {
    e.stopPropagation(); // Prevent gallery shortcuts from interfering
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const groupName = input.value.trim();
      if (groupName) {
        const groupId = `group-${Date.now()}`;
        const selectedDoodles = Array.from(selectedItems).map(id => getDoodleById(id)).filter(Boolean);
        
        const group = {
          id: groupId,
          name: groupName,
          items: selectedDoodles,
          created: new Date().toISOString()
        };
        
        galleryGroups.push(group);
        saveGalleryGroups();
        
        // Clear selection and refresh gallery
        selectedItems.clear();
        updateGlobalSelectedItems();
        updateDoodleGallery();
        
        // Update the full gallery modal in real time
        updateFullGallery();
        
        // Rebuild navigation system after gallery update
        buildNavigationItems();
        
        // Ensure click handlers are properly attached
        addGalleryItemClickHandlers();
        setupGalleryDragAndDrop();
        
        // Sync cursor index with new navigation array
        syncCursorIndex();
        updateGalleryCursor();
      }
      
      // Clean up
      document.body.removeChild(backdrop);
      document.body.removeChild(input);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Clean up without creating group
      document.body.removeChild(backdrop);
      document.body.removeChild(input);
    }
  };
  
  input.addEventListener('keydown', handleInput);
  
  // Click backdrop to cancel
  backdrop.addEventListener('click', () => {
    document.body.removeChild(backdrop);
    document.body.removeChild(input);
  });
}

/**
 * Ungroup selected items
 */
function ungroupSelected() {
  if (selectedItems.size === 0) {
    alert('Please select items to ungroup');
    return;
  }
  
  // Find selected groups and ungroup them
  const selectedGroups = [];
  selectedItems.forEach(itemId => {
    if (itemId.startsWith('group-')) {
      const groupIndex = parseInt(itemId.replace('group-', ''));
      if (groupIndex >= 0 && groupIndex < galleryGroups.length) {
        selectedGroups.push(groupIndex);
      }
    }
  });
  
  if (selectedGroups.length === 0) {
    alert('Please select groups to ungroup');
    return;
  }
  
  // Remove selected groups (this will ungroup all items in those groups)
  galleryGroups = galleryGroups.filter((group, index) => !selectedGroups.includes(index));
  
  saveGalleryGroups();
  selectedItems.clear();
  updateGlobalSelectedItems();
  updateDoodleGallery();
  
  // Update the full gallery modal in real time
  updateFullGallery();
  
  // Rebuild navigation system after gallery update
  buildNavigationItems();
  
  // Ensure click handlers are properly attached
  addGalleryItemClickHandlers();
  setupGalleryDragAndDrop();
  
  // Sync cursor index with new navigation array
  syncCursorIndex();
  updateGalleryCursor();
}

/**
 * Delete selected items
 */
function deleteSelected() {
  if (selectedItems.size === 0) {
    alert('Please select items to delete');
    return;
  }
  
  showDeleteConfirmation();
}

/**
 * Show delete confirmation modal
 */
function showDeleteConfirmation() {
  const modal = getElementById('deleteConfirmModal');
  const message = getElementById('deleteConfirmMessage');
  
  if (modal && message) {
    message.textContent = `Are you sure you want to delete ${selectedItems.size} selected item${selectedItems.size > 1 ? 's' : ''}? This action cannot be undone.`;
    addClass(modal, 'show');
    modal.removeAttribute('aria-hidden');
  }
}

/**
 * Hide delete confirmation modal
 */
function hideDeleteConfirmation() {
  const modal = getElementById('deleteConfirmModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Confirm delete action
 */
function confirmDelete() {
  // Remove from groups
  galleryGroups.forEach(group => {
    group.items = group.items.filter(item => !selectedItems.has(item.id));
  });
  
  // Remove empty groups
  galleryGroups = galleryGroups.filter(group => group.items.length > 0);
  
  // Remove from main doodles storage
  const doodlesData = getItem('site-blocker:doodles');
  if (doodlesData) {
    const doodles = JSON.parse(doodlesData);
    const filteredDoodles = doodles.filter(doodle => !selectedItems.has(doodle.id));
    setItem('site-blocker:doodles', JSON.stringify(filteredDoodles));
  }
  
  saveGalleryGroups();
  selectedItems.clear();
  updateGlobalSelectedItems();
  updateDoodleGallery();
  
  // Update the full gallery modal in real time
  updateFullGallery();
  
  // Rebuild navigation system after gallery update
  buildNavigationItems();
  
  // Ensure click handlers are properly attached
  addGalleryItemClickHandlers();
  setupGalleryDragAndDrop();
  
  // Sync cursor index with new navigation array
  syncCursorIndex();
  updateGalleryCursor();
  
  hideDeleteConfirmation();
}

/**
 * Move selected items
 */
function moveSelectedItems(direction) {
  // Implementation for moving items up/down in gallery
  console.log('Moving items:', direction);
}

/**
 * Update selected count display
 */
function updateSelectedCount() {
  const countEl = getElementById('selectedCount');
  if (countEl) {
    updateTextContent(countEl, `${selectedItems.size} selected`);
  }
  
  // Also update global selected count
  const globalCountEl = getElementById('globalSelectedCount');
  if (globalCountEl) {
    updateTextContent(globalCountEl, `${selectedItems.size} selected`);
  }
}

/**
 * Clear all visual selections
 */
function clearAllSelections() {
  if (!galleryItems || galleryItems.length === 0) return;
  
  galleryItems.forEach(item => {
    item.classList.remove('selected');
    item.removeAttribute('data-selection-index');
  });
  
  // Clear group selections
  document.querySelectorAll('.gallery-group').forEach(group => {
    group.classList.remove('selected');
    group.removeAttribute('data-selection-index');
  });
  
  // Update selection indices (will be empty now)
  updateSelectionIndices();
}

/**
 * Get doodle by ID
 */
function getDoodleById(id) {
  const doodlesData = getItem('site-blocker:doodles');
  if (!doodlesData) return null;
  
  // doodlesData is already parsed by getItem
  const doodles = Array.isArray(doodlesData) ? doodlesData : [];
  return doodles.find(doodle => doodle.id === id);
}

/**
 * Move item in gallery
 */
function moveItemInGallery(draggedId, targetId) {
  if (draggedId === targetId) return;
  
  // Check if we're moving doodles or groups by looking at the navigation items
  const draggedItem = galleryNavigationItems.find(item => item.id === draggedId);
  const targetItem = galleryNavigationItems.find(item => item.id === targetId);
  
  if (!draggedItem || !targetItem) return;
  
  if (draggedItem.type === 'group' && targetItem.type === 'group') {
    // Moving groups
    moveGroupsInGallery(draggedId, targetId);
  } else if (draggedItem.type === 'doodle' && targetItem.type === 'doodle') {
    // Moving doodles
    moveDoodlesInGallery(draggedId, targetId);
  } else {
    // Can't move between different types
    return;
  }
}

/**
 * Move doodles in gallery
 */
function moveDoodlesInGallery(draggedId, targetId) {
  // Get doodles data
  const doodles = getItem('site-blocker:doodles') || [];
  const draggedIndex = doodles.findIndex(d => d.id === draggedId);
  const targetIndex = doodles.findIndex(d => d.id === targetId);
  
  if (draggedIndex === -1 || targetIndex === -1) return;
  
  // Remove dragged item from its current position
  const draggedItem = doodles.splice(draggedIndex, 1)[0];
  
  // Find new target index (account for the removal)
  const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
  
  // Insert at new position
  doodles.splice(newTargetIndex, 0, draggedItem);
  
  // Save updated doodles
  setItem('site-blocker:doodles', doodles);
  
  // Just rebuild navigation items without touching DOM
  if (currentGroupIndex >= 0) {
    const group = galleryGroups[currentGroupIndex];
    buildGroupNavigationItems(group);
  } else {
    buildNavigationItems();
  }
}

/**
 * Move groups in gallery
 */
function moveGroupsInGallery(draggedId, targetId) {
  // Find group indices by ID
  const draggedGroupIndex = galleryGroups.findIndex(g => g.id === draggedId);
  const targetGroupIndex = galleryGroups.findIndex(g => g.id === targetId);
  
  if (draggedGroupIndex === -1 || targetGroupIndex === -1) return;
  if (draggedGroupIndex === targetGroupIndex) return;
  
  // Remove dragged group from its current position
  const draggedGroup = galleryGroups.splice(draggedGroupIndex, 1)[0];
  
  // Find new target index (account for the removal)
  const newTargetIndex = draggedGroupIndex < targetGroupIndex ? targetGroupIndex - 1 : targetGroupIndex;
  
  // Insert at new position
  galleryGroups.splice(newTargetIndex, 0, draggedGroup);
  
  // Save updated groups
  saveGalleryGroups();
  
  // Just rebuild navigation items without touching DOM
  if (currentGroupIndex >= 0) {
    const group = galleryGroups[currentGroupIndex];
    buildGroupNavigationItems(group);
  } else {
    buildNavigationItems();
  }
}


/**
 * Update gallery order without resetting navigation
 */
function updateGalleryOrder() {
  const galleryEl = getElementById('doodleGallery');
  if (!galleryEl) return;
  
  // Get current doodles in the new order
  const doodles = getItem('site-blocker:doodles') || [];
  
  if (currentGroupIndex >= 0) {
    // We're inside a group, update group items
    const group = galleryGroups[currentGroupIndex];
    if (!group) return;
    
    // Update group items order
    group.items = doodles.filter(doodle => 
      group.items.some(item => item.id === doodle.id)
    );
    
    // Re-render group items
    renderGroupItems(group);
  } else {
    // We're in main gallery, update main gallery
    const ungroupedItems = doodles.filter(doodle => !galleryGroups.some(group => 
      group.items.some(item => item.id === doodle.id)
    ));
    
    // Find ungrouped container and update it
    const ungroupedContainer = galleryEl.querySelector('.ungrouped-items') || galleryEl;
    if (ungroupedContainer) {
      // Clear existing ungrouped items
      const existingItems = ungroupedContainer.querySelectorAll('.gallery-item:not([data-group-index])');
      existingItems.forEach(item => item.remove());
      
      // Add ungrouped items in new order
      ungroupedItems.forEach((doodle, index) => {
        const itemEl = createGalleryItem(doodle, index);
        ungroupedContainer.appendChild(itemEl);
      });
    }
  }
  
  // Rebuild navigation items
  if (currentGroupIndex >= 0) {
    const group = galleryGroups[currentGroupIndex];
    buildGroupNavigationItems(group);
  } else {
    buildNavigationItems();
  }
  
  // Ensure cursor is visible after rebuilding
  updateGalleryCursor();
}

/**
 * Enter group to view its contents
 */
function enterGroup(groupIndex) {
  const group = galleryGroups[groupIndex];
  if (!group) return;
  
  // Set current group context
  currentGroupIndex = groupIndex;
  window.currentGroupIndex = currentGroupIndex;
  
  // Update gallery to show only group items
  renderGroupItems(group);
  
  // Update navigation items for group (after DOM is rendered)
  buildGroupNavigationItems(group);
  
  // Sync cursor index with new navigation array
  syncCursorIndex();
  
  // Ensure cursor is visible
  updateGalleryCursor();
  
  // Show group navigation hint
  showGroupNavigationHint(group.name);
}

/**
 * Exit group and return to main gallery
 */
function exitGroup() {
  currentGroupIndex = -1;
  window.currentGroupIndex = currentGroupIndex;
  
  // Re-render full gallery
  const doodles = getItem('site-blocker:doodles') || [];
  renderGalleryItems(doodles);
  
  // Rebuild navigation items
  buildNavigationItems();
  
  // Sync cursor index with new navigation array
  syncCursorIndex();
  
  // Ensure cursor is visible
  updateGalleryCursor();
  
  // Hide group navigation hint
  hideGroupNavigationHint();
}

/**
 * Show group navigation hint
 */
function showGroupNavigationHint(groupName) {
  const hint = document.createElement('div');
  hint.id = 'groupNavigationHint';
  hint.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(59, 130, 246, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    z-index: 10001;
    pointer-events: none;
  `;
  hint.textContent = `Viewing: ${groupName} • Press 'b' to go back`;
  document.body.appendChild(hint);
}

/**
 * Hide group navigation hint
 */
function hideGroupNavigationHint() {
  const hint = document.getElementById('groupNavigationHint');
  if (hint) {
    hint.remove();
  }
}

/**
 * Render group items only
 */
function renderGroupItems(group) {
  const galleryEl = getElementById('doodleGallery');
  galleryEl.innerHTML = '';
  galleryItems = [];
  
  group.items.forEach((item, index) => {
    const itemEl = createGalleryItem(item, index);
    galleryEl.appendChild(itemEl);
    galleryItems.push(itemEl);
  });
  
  // Setup interactions
  addGalleryItemClickHandlers();
  setupGalleryDragAndDrop();
}

/**
 * Build navigation items for group
 */
function buildGroupNavigationItems(group) {
  galleryNavigationItems = [];
  
  group.items.forEach((item, index) => {
    // Find the corresponding DOM element
    const itemEl = document.querySelector(`[data-item-id="${item.id}"]`);
    
    galleryNavigationItems.push({
      type: 'doodle',
      id: item.id,
      index: index,
      element: itemEl
    });
  });
}

/**
 * Move current item right (next position)
 */
function moveCurrentItemRight() {
  if (currentFocusIndex < 0 || currentFocusIndex >= galleryNavigationItems.length - 1) return;
  
  const currentItem = galleryNavigationItems[currentFocusIndex];
  const nextItem = galleryNavigationItems[currentFocusIndex + 1];
  
  // Can't move if next item doesn't exist
  if (!nextItem) return;
  
  // Move the item
  moveItemInGallery(currentItem.id, nextItem.id);
  
  // The item moved right, so it should be at currentFocusIndex + 1
  currentFocusIndex = Math.min(currentFocusIndex + 1, galleryNavigationItems.length - 1);
  
  // Ensure cursor is always visible
  updateGalleryCursor();
}

/**
 * Move current item left (previous position)
 */
function moveCurrentItemLeft() {
  if (currentFocusIndex <= 0 || currentFocusIndex >= galleryNavigationItems.length) return;
  
  const currentItem = galleryNavigationItems[currentFocusIndex];
  const prevItem = galleryNavigationItems[currentFocusIndex - 1];
  
  // Can't move if prev item doesn't exist
  if (!prevItem) return;
  
  // Move the item
  moveItemInGallery(currentItem.id, prevItem.id);
  
  // The item moved left, so cursor should follow to the previous position
  currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
  
  // Ensure cursor is always visible
  updateGalleryCursor();
}

/**
 * Move current item to the end
 */
function moveCurrentItemToEnd() {
  if (currentFocusIndex < 0 || currentFocusIndex >= galleryNavigationItems.length) return;
  
  const currentItem = galleryNavigationItems[currentFocusIndex];
  
  // Find the last item of the same type
  let lastItemIndex = -1;
  for (let i = galleryNavigationItems.length - 1; i >= 0; i--) {
    if (galleryNavigationItems[i].type === currentItem.type) {
      lastItemIndex = i;
      break;
    }
  }
  
  if (lastItemIndex === -1 || lastItemIndex === currentFocusIndex) return;
  
  const lastItem = galleryNavigationItems[lastItemIndex];
  moveItemInGallery(currentItem.id, lastItem.id);
  
  // The item moved to the end, so cursor should be at the last position
  currentFocusIndex = galleryNavigationItems.length - 1;
  
  // Ensure cursor is always visible
  updateGalleryCursor();
}

/**
 * Move current item to the start
 */
function moveCurrentItemToStart() {
  if (currentFocusIndex < 0 || currentFocusIndex >= galleryNavigationItems.length) return;
  
  const currentItem = galleryNavigationItems[currentFocusIndex];
  
  // Find the first item of the same type
  let firstItemIndex = -1;
  for (let i = 0; i < galleryNavigationItems.length; i++) {
    if (galleryNavigationItems[i].type === currentItem.type) {
      firstItemIndex = i;
      break;
    }
  }
  
  if (firstItemIndex === -1 || firstItemIndex === currentFocusIndex) return;
  
  const firstItem = galleryNavigationItems[firstItemIndex];
  moveItemInGallery(currentItem.id, firstItem.id);
  
  // The item moved to the start, so cursor should be at the first position
  currentFocusIndex = 0;
  
  // Ensure cursor is always visible
  updateGalleryCursor();
}

/**
 * Toggle group selection
 */
function toggleGroupSelection(groupIndex) {
  const group = galleryGroups[groupIndex];
  if (!group) return;
  
  // Update selected items set first
  const groupId = `group-${groupIndex}`;
  if (selectedItems.has(groupId)) {
    selectedItems.delete(groupId);
  } else {
    selectedItems.add(groupId);
  }
  
  // Update selection indices for all selected items (this will handle the group)
  updateSelectionIndices();
  updateSelectedCount();
}

/**
 * Add click handlers to gallery items
 */
function addGalleryItemClickHandlers() {
  // Get all gallery items from the DOM, not just from galleryItems array
  const allGalleryItems = document.querySelectorAll('[data-item-id]');
  
  allGalleryItems.forEach(item => {
    const thumbnail = item.querySelector('.gallery-thumbnail');
    
    if (thumbnail) {
      // Remove existing listeners to avoid duplicates
      thumbnail.removeEventListener('click', handleThumbnailClick);
      thumbnail.removeEventListener('contextmenu', handleThumbnailRightClick);
      
      // Add new listeners
      thumbnail.addEventListener('click', handleThumbnailClick);
      thumbnail.addEventListener('contextmenu', handleThumbnailRightClick);
    }
    
    // Also add right-click to the item element itself as fallback
    item.removeEventListener('contextmenu', handleItemRightClick);
    item.addEventListener('contextmenu', handleItemRightClick);
  });
}

/**
 * Handle thumbnail click
 */
function handleThumbnailClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const item = e.target.closest('[data-item-id]');
  if (!item) return;
  
  if (galleryFocused) {
    // In focus mode, toggle selection
    toggleItemSelection(item.dataset.itemId);
  } else {
    // In normal mode, show modal
    const doodle = getDoodleById(item.dataset.itemId);
    if (doodle) showDoodleModal(doodle);
  }
}

/**
 * Handle thumbnail right-click
 */
function handleThumbnailRightClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const item = e.target.closest('[data-item-id]');
  if (!item) return;
  
  toggleItemSelection(item.dataset.itemId);
}

/**
 * Handle item right-click
 */
function handleItemRightClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const item = e.target.closest('[data-item-id]');
  if (!item) return;
  
  toggleItemSelection(item.dataset.itemId);
}

/**
 * Build navigation items array
 */
function buildNavigationItems() {
  galleryNavigationItems = [];
  
  // Add groups first
  if (galleryGroups && galleryGroups.length > 0) {
    galleryGroups.forEach((group, groupIndex) => {
      galleryNavigationItems.push({
        type: 'group',
        id: group.id,
        groupIndex: groupIndex,
        name: group.name,
        element: document.querySelector(`[data-group-id="${group.id}"]`)
      });
    });
  }
  
  // Add ungrouped items (query DOM directly)
  const ungroupedItems = document.querySelectorAll('.gallery-item:not([data-group-index])');
  ungroupedItems.forEach(item => {
    galleryNavigationItems.push({
      type: 'doodle',
      id: item.dataset.itemId,
      name: `Doodle ${item.dataset.itemIndex}`,
      element: item
    });
  });
}

/**
 * Navigate gallery with keyboard (matrix navigation)
 */
function navigateGallery(direction) {
  if (galleryNavigationItems.length === 0) return;
  
  // Calculate grid dimensions based on actual rendered items
  const container = document.getElementById('doodleGallery');
  if (!container) return;
  
  // Get the first gallery item to measure actual dimensions
  const firstItem = container.querySelector('.gallery-item, .gallery-group');
  if (!firstItem) {
    // Fallback to linear navigation if no items found
    currentFocusIndex += direction;
    if (currentFocusIndex < 0) {
      currentFocusIndex = galleryNavigationItems.length - 1;
    } else if (currentFocusIndex >= galleryNavigationItems.length) {
      currentFocusIndex = 0;
    }
    updateGalleryCursor();
    return;
  }
  
  // Get actual item dimensions from the rendered element
  const itemRect = firstItem.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Use the calculated optimal layout
  const itemsPerRow = parseInt(container.style.getPropertyValue('--items-per-row')) || 11;
  
  if (itemsPerRow <= 0) {
    // Fallback to linear navigation if grid calculation fails
    currentFocusIndex += direction;
    if (currentFocusIndex < 0) {
      currentFocusIndex = galleryNavigationItems.length - 1;
    } else if (currentFocusIndex >= galleryNavigationItems.length) {
      currentFocusIndex = 0;
    }
    updateGalleryCursor();
    return;
  }
  
  // Calculate current row and column
  const currentRow = Math.floor(currentFocusIndex / itemsPerRow);
  const currentCol = currentFocusIndex % itemsPerRow;
  
  // Calculate new position based on direction
  let newRow = currentRow;
  let newCol = currentCol;
  
  switch (direction) {
    case 1: // j - down (keep same column, move to next row)
      newRow = currentRow + 1;
      newCol = currentCol; // Explicitly keep same column
      break;
    case -1: // k - up (keep same column, move to previous row)
      newRow = currentRow - 1;
      newCol = currentCol; // Explicitly keep same column
      break;
    case 2: // l - right (move to next column, same row)
      newRow = currentRow; // Keep same row
      newCol = currentCol + 1;
      if (newCol >= itemsPerRow) {
        newRow = currentRow + 1;
        newCol = 0;
      }
      break;
    case -2: // h - left (move to previous column, same row)
      newRow = currentRow; // Keep same row
      newCol = currentCol - 1;
      if (newCol < 0) {
        newRow = currentRow - 1;
        newCol = itemsPerRow - 1;
      }
      break;
  }
  
  // Calculate new index
  const newIndex = newRow * itemsPerRow + newCol;
  
  // Handle bounds checking
  if (newIndex < 0) {
    // Go to last item
    currentFocusIndex = galleryNavigationItems.length - 1;
  } else if (newIndex >= galleryNavigationItems.length) {
    // For down movement (j), if we go beyond the last row, stay in the same column of the last row
    if (direction === 1) { // j - down
      const lastRow = Math.floor((galleryNavigationItems.length - 1) / itemsPerRow);
      currentFocusIndex = lastRow * itemsPerRow + currentCol;
      // If that position doesn't exist, go to the last item
      if (currentFocusIndex >= galleryNavigationItems.length) {
        currentFocusIndex = galleryNavigationItems.length - 1;
      }
    } else {
      // For other movements, go to first item
      currentFocusIndex = 0;
    }
  } else {
    currentFocusIndex = newIndex;
  }
  
  updateGalleryCursor();
}

/**
 * Navigate to first item
 */
function navigateToFirst() {
  if (galleryNavigationItems.length === 0) return;
  currentFocusIndex = 0;
  updateGalleryCursor();
}

function navigateToLast() {
  if (galleryNavigationItems.length === 0) return;
  currentFocusIndex = galleryNavigationItems.length - 1;
  updateGalleryCursor();
}

/**
 * Toggle current selection
 */
function toggleCurrentSelection() {
  if (currentFocusIndex >= 0 && currentFocusIndex < galleryNavigationItems.length) {
    const item = galleryNavigationItems[currentFocusIndex];
    if (item.type === 'doodle') {
      toggleItemSelection(item.id);
    } else if (item.type === 'group') {
      toggleGroupSelection(item.groupIndex);
    }
  }
}

/**
 * Show doodle in modal
 */
function showDoodleModal(doodle) {
  // Remove existing modal if any
  const existingModal = getElementById('doodleViewModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.id = 'doodleViewModal';
  modal.className = 'doodle-modal modal';
  
  const content = document.createElement('div');
  content.className = 'doodle-modal-content';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'doodle-modal-close';
  closeBtn.innerHTML = '×';
  closeBtn.addEventListener('click', () => hideDoodleModal());
  
  const image = document.createElement('img');
  image.className = 'doodle-modal-image';
  image.src = doodle.imageData;
  image.alt = 'Doodle';
  
  const info = document.createElement('div');
  info.style.cssText = 'margin-top: 12px; text-align: center; color: #94a3b8; font-size: 0.9rem;';
  info.textContent = `Created: ${new Date(doodle.timestamp).toLocaleString()} • Type: ${doodle.type}`;
  
  content.appendChild(closeBtn);
  content.appendChild(image);
  content.appendChild(info);
  modal.appendChild(content);
  
  document.body.appendChild(modal);
  
  // Show modal immediately
  modal.classList.add('show');
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideDoodleModal();
    }
  });
  
  // Keyboard handling is now managed by the global modal manager
}

/**
 * Hide doodle modal
 */
function hideDoodleModal() {
  const modal = getElementById('doodleViewModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }
  
  // Remove any existing keydown listeners for doodle modal
  // Keyboard handling is now managed by the global modal manager
}

// Keyboard handling is now managed by the global modal manager

/**
 * Hide all modals
 */
function hideAllModals() {
  // Hide doodle modal
  hideDoodleModal();
  
  // Hide gallery modal
  hideGalleryModal();
  
  // Hide delete confirmation modal
  hideDeleteConfirmation();
  
  // Hide other modals if they exist
  const modals = document.querySelectorAll('.modal.show');
  modals.forEach(modal => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Shuffle array in place (Fisher-Yates algorithm)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Render a progress chart with bars
 * @param {string} containerId - ID of the chart container
 * @param {Array} data - Array of numeric values
 * @param {string} color - Color for the bars
 */
function renderProgressChart(containerId, data, color) {
  const container = getElementById(containerId);
  if (!container || data.length === 0) return;
  
  // Clear placeholder
  const placeholder = container.querySelector('.chart-placeholder');
  if (placeholder) {
    placeholder.remove();
  }
  
  // Normalize data to 0-100 range
  const maxValue = Math.max(...data);
  const normalizedData = maxValue > 0 ? data.map(val => (val / maxValue) * 100) : data;
  
  // Create bars container
  const barsContainer = createElement('div');
  barsContainer.className = 'chart-bars';
  
  // Create bars
  normalizedData.forEach((value, index) => {
    const bar = createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = `${Math.max(value, 4)}%`;
    bar.style.background = `linear-gradient(180deg, ${color}, ${adjustColorBrightness(color, -20)})`;
    bar.setAttribute('data-value', data[index]);
    barsContainer.appendChild(bar);
  });
  
  // Clear and add bars
  container.innerHTML = '';
  container.appendChild(barsContainer);
}

/**
 * Adjust color brightness
 * @param {string} color - Hex color
 * @param {number} percent - Brightness adjustment (-100 to 100)
 * @returns {string} Adjusted hex color
 */
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
