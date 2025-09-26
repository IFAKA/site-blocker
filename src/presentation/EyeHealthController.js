/**
 * Presentation layer for Eye Health UI
 * Handles eye health interface and user interactions
 */

import { 
  getCurrentEyeHealthInfo, 
  getEyeHealthProgress, 
  moveToNextEyeHealthPhase, 
  resetEyeHealthCycle, 
  getCurrentEyeHealthTiming,
  getBreathingPatternInfo,
  getBreathingCycleInfo,
  startEyeHealthSession,
  endEyeHealthSession
} from '../application/EyeHealthService.js';
import { 
  getElementById, 
  updateTextContent, 
  addClass, 
  removeClass, 
  addEventListener, 
  showElement, 
  hideElement,
  updateInnerHTML
} from '../infrastructure/UI.js';
import { isTopModal } from './ModalManager.js';
import { 
  playEyeHealthFocusStart, 
  playEyeHealthMovementStart, 
  playEyeHealthBreathingStart, 
  playEyeHealthRelaxationStart,
  playEyeHealthPhaseTransition,
  playEyeHealthComplete,
  playBreathingCue
} from '../infrastructure/Audio.js';
import {
  initializeChineseAudio,
  speakChineseText,
  isTTSSupported as isChineseTTSSupported
} from '../infrastructure/ChineseAudio.js';
import { speakEnglishText, isTTSSupported as isGenericTTSSupported } from '../infrastructure/TTS.js';

/**
 * Initialize eye health functionality
 */
export function initializeEyeHealth() {
  renderCurrentEyeHealth();
  setupEyeHealthControls();
  setupEyeHealthModal();
  setupEyeHealthKeyboardShortcuts();
  // Best-effort initialize audio/TTS (may require user gesture in some browsers)
  try { initializeChineseAudio(); } catch (e) { /* no-op */ }
}

/**
 * Render current eye health information
 */
export function renderCurrentEyeHealth() {
  const info = getCurrentEyeHealthInfo();
  if (!info) return;
  
  const titleEl = getElementById('eyeTitle');
  const subtitleEl = getElementById('eyeSubtitle');
  const instructionEl = getElementById('eyeInstruction');
  const progressEl = getElementById('eyeProgress');
  
  if (titleEl) updateTextContent(titleEl, info.title);
  if (subtitleEl) updateTextContent(subtitleEl, info.subtitle);
  if (instructionEl) updateTextContent(instructionEl, info.instruction);
  if (progressEl) updateTextContent(progressEl, info.progress);
}

/**
 * Setup eye health modal
 */
function setupEyeHealthModal() {
  const openBtn = getElementById('eyeHealthBtn');
  const modal = getElementById('eyeHealthModal');
  const closeBtn = getElementById('eyeClose');
  
  if (openBtn) {
    addEventListener(openBtn, 'click', () => {
      showEyeHealthModal();
    });
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', () => {
      hideEyeHealthModal();
    });
  }
}

/**
 * Setup eye health keyboard shortcuts
 */
function setupEyeHealthKeyboardShortcuts() {
  addEventListener(document, 'keydown', (ev) => {
    const key = ev.key.toLowerCase();
    
    // Only handle eye health shortcuts when modal is open
    const modal = getElementById('eyeHealthModal');
    if (!modal || !modal.classList.contains('show')) return;
    if (!isTopModal('eyeHealthModal')) return;
    
    // Skip if typing in input fields
    if (isTypingContext(document.activeElement)) return;
    
    if (key === 'n') {
      ev.preventDefault();
      const skipBtn = getElementById('eyeSkip');
      if (skipBtn) skipBtn.click();
    }
    
    if (key === 't') {
      ev.preventDefault();
      const resetBtn = getElementById('eyeReset');
      if (resetBtn) resetBtn.click();
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
 * Setup eye health control buttons
 */
function setupEyeHealthControls() {
  const startBtn = getElementById('eyeStart');
  const skipBtn = getElementById('eyeSkip');
  const resetBtn = getElementById('eyeReset');
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleStartEyeHealth);
  }
  
  if (skipBtn) {
    addEventListener(skipBtn, 'click', handleSkipEyeHealth);
  }
  
  if (resetBtn) {
    addEventListener(resetBtn, 'click', handleResetEyeHealth);
  }
}

/**
 * Handle start eye health button click
 */
function handleStartEyeHealth() {
  if (isEyeHealthRunning()) {
    cancelEyeHealth();
  } else {
    startEyeHealth();
  }
}

/**
 * Handle skip eye health button click
 */
function handleSkipEyeHealth() {
  moveToNextEyeHealthPhase();
  renderCurrentEyeHealth();
  cancelEyeHealth();
}

/**
 * Handle reset eye health button click
 */
function handleResetEyeHealth() {
  resetEyeHealthCycle();
  renderCurrentEyeHealth();
  cancelEyeHealth();
}

// Eye health timer state
let eyeHealthTimer = null;
let eyeHealthSeconds = 0;
let eyeHealthPhase = 0;
let eyeHealthRunning = false;
let eyeHealthSession = null;

/**
 * Check if eye health is currently running
 * @returns {boolean} True if running
 */
function isEyeHealthRunning() {
  return eyeHealthRunning;
}

/**
 * Start eye health timer
 */
function startEyeHealth() {
  if (eyeHealthRunning) return;
  
  eyeHealthRunning = true;
  eyeHealthSession = startEyeHealthSession();
  eyeHealthPhase = 0;
  eyeHealthSeconds = 0;
  
  updateStartButton('Starting...');
  playEyeHealthFocusStart();
  if (isGenericTTSSupported()) {
    // Intro prompt in English
    speakEnglishText('Starting one minute eye routine. Get ready.');
  }
  
  // Start the 1-minute routine with 3-second accommodation
  eyeHealthTimer = setInterval(() => {
    eyeHealthSeconds += 1;
    
    // Handle accommodation period (0-3s)
    if (eyeHealthSeconds <= 3) {
      handleAccommodationPhase();
    } else if (eyeHealthSeconds <= 18) {
      // Phase 1: Distance Focus (3-18s)
      handleFocusPhase();
    } else if (eyeHealthSeconds <= 33) {
      // Phase 2: Eye Exercises (18-33s)
      handleMovementPhase();
    } else if (eyeHealthSeconds <= 48) {
      // Phase 3: Box Breathing (33-48s)
      handleBreathingPhase();
    } else if (eyeHealthSeconds <= 63) {
      // Phase 4: Eye Relaxation (48-63s)
      handleRelaxationPhase();
    } else {
      // Complete
      completeEyeHealth();
    }
  }, 1000);
}

/**
 * Handle accommodation phase (0-3s)
 */
function handleAccommodationPhase() {
  const remaining = 3 - eyeHealthSeconds;
  updateStartButton(`Get ready... ${remaining}s`);
  updateInstruction('Get ready for the eye routine');
  if (eyeHealthSeconds === 1 && isGenericTTSSupported()) {
    speakEnglishText('Sit up straight. Relax your neck and shoulders.');
  }
}

/**
 * Handle focus phase (3-18s)
 */
function handleFocusPhase() {
  const remaining = 18 - eyeHealthSeconds;
  updateStartButton(`Focus on distance (${remaining}s)`);
  
  if (eyeHealthSeconds === 4) {
    updateInstruction('Look far away. Keep your eyes still.');
    if (isGenericTTSSupported()) {
      speakEnglishText('Look far into the distance and hold your gaze.');
    }
  }
}

/**
 * Handle movement phase (18-33s)
 */
function handleMovementPhase() {
  if (eyeHealthSeconds === 19) {
    playEyeHealthMovementStart();
    updateInstruction('Move eyes: left, right, up, down. Slow circles.');
    if (isGenericTTSSupported()) {
      speakEnglishText('Move your eyes left, right, up and down, then make slow circles.');
    }
  }
  
  const remaining = 33 - eyeHealthSeconds;
  updateStartButton(`Eye exercises (${remaining}s)`);
}

/**
 * Handle breathing phase (33-48s)
 */
function handleBreathingPhase() {
  if (eyeHealthSeconds === 34) {
    playEyeHealthBreathingStart();
    updateInstruction('Box breathing');
    if (isGenericTTSSupported()) {
      speakEnglishText('Box breathing. Breathe in for four seconds, hold for four, out for four, and hold for four.');
    }
  }
  
  const remaining = 48 - eyeHealthSeconds;
  const breathingInfo = getBreathingCycleInfo(eyeHealthSeconds - 33);
  
  updateStartButton(`Box breathing (${remaining}s)`);
  updateBreathingVisual(breathingInfo);

  // Reflect current phase in the main instruction with countdown
  const instructionPhaseText = {
    inhale: 'Breathe in',
    hold1: 'Hold',
    exhale: 'Breathe out',
    hold2: 'Hold'
  };
  const phaseLabel = instructionPhaseText[breathingInfo.currentPhase] || 'Breathe';
  updateInstruction(`${phaseLabel} (${breathingInfo.phaseRemaining}s)`);
}

/**
 * Handle relaxation phase (48-63s)
 */
function handleRelaxationPhase() {
  if (eyeHealthSeconds === 49) {
    playEyeHealthRelaxationStart();
    updateInstruction('Blink gently. Relax your eyes.');
    if (isGenericTTSSupported()) {
      speakEnglishText('Blink gently and relax the muscles around your eyes.');
    }
  }
  
  const remaining = 63 - eyeHealthSeconds;
  updateStartButton(`Eye relaxation (${remaining}s)`);
}

/**
 * Complete eye health routine
 */
function completeEyeHealth() {
  clearInterval(eyeHealthTimer);
  eyeHealthTimer = null;
  eyeHealthRunning = false;
  
  updateStartButton('Start routine');
  updateInstruction('Eye health routine complete!');
  playEyeHealthComplete();
  if (isGenericTTSSupported()) {
    speakEnglishText('All done. Great job. Remember to rest your eyes often.');
  }
  
  // Move to next phase for next time
  moveToNextEyeHealthPhase();
  renderCurrentEyeHealth();
  
  // End session
  endEyeHealthSession();

  // Auto-close the modal after completion
  hideEyeHealthModal();
}

/**
 * Cancel eye health timer
 */
function cancelEyeHealth() {
  if (eyeHealthTimer) {
    clearInterval(eyeHealthTimer);
    eyeHealthTimer = null;
  }
  eyeHealthRunning = false;
  updateStartButton('Start routine');
  updateInstruction('Routine cancelled.');
  hideBreathingVisual();
  if (isGenericTTSSupported()) {
    speakEnglishText('Routine cancelled.');
  }
}

/**
 * Update start button text
 * @param {string} text - Button text
 */
function updateStartButton(text) {
  const startBtn = getElementById('eyeStart');
  if (startBtn) {
    updateTextContent(startBtn, text);
  }
}

/**
 * Update instruction text
 * @param {string} text - Instruction text
 */
function updateInstruction(text) {
  const instructionEl = getElementById('eyeInstruction');
  if (instructionEl) {
    updateTextContent(instructionEl, text);
  }
}

/**
 * Update breathing visual
 * @param {Object} breathingInfo - Breathing cycle information
 */
function updateBreathingVisual(breathingInfo) {
  const breathingEl = getElementById('eyeBreathing');
  if (!breathingEl) return;
  
  const phaseText = {
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold'
  };
  
  const text = `${phaseText[breathingInfo.currentPhase]} (${breathingInfo.phaseRemaining}s)`;
  updateTextContent(breathingEl, text);
  showElement(breathingEl);
  
  // Play breathing cue
  if (breathingInfo.currentPhase === 'inhale' && breathingInfo.phaseProgress === 0) {
    playBreathingCue();
  }
}

/**
 * Hide breathing visual
 */
function hideBreathingVisual() {
  const breathingEl = getElementById('eyeBreathing');
  if (breathingEl) {
    hideElement(breathingEl);
  }
}

/**
 * Show eye health modal
 */
export function showEyeHealthModal() {
  const modal = getElementById('eyeHealthModal');
  if (modal) {
    addClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'false');
    renderCurrentEyeHealth();
    // Auto-start the routine when modal opens
    setTimeout(() => {
      startEyeHealth();
    }, 100); // Small delay to ensure modal is fully visible
  }
}

/**
 * Hide eye health modal
 */
export function hideEyeHealthModal() {
  const modal = getElementById('eyeHealthModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
    cancelEyeHealth();
  }
}
