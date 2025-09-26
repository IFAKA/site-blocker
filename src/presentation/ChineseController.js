/**
 * Presentation layer for Chinese Language Learning UI
 * Handles Chinese learning interface and user interactions
 */

import { 
  startChineseSession, 
  getCurrentSessionVocabulary, 
  getCurrentSession,
  startVoiceRecording,
  stopVoiceRecording,
  getSessionRecordings,
  clearCurrentSession,
  getVocabularyProgressForUser,
  updateVocabularyProgressForUser,
  getOverallLearningStatsForUser,
  getVocabularyStats,
  getAvailableDifficultyLevels,
  getRemainingSessionTime,
  shouldAutoCloseSession,
  getLearningRecommendations
} from '../application/ChineseService.js';
import { 
  getRandomVocabulary,
  getNextVocabulary,
  getPrevVocabulary
} from '../domain/Chinese.js';
import { 
  initializeChineseAudio,
  checkMicrophoneAccess,
  speakChineseWord,
  speakChineseSentence,
  speakChineseWordOnly,
  speakChineseSentenceOnly,
  playRecordedAudio,
  playCorrectPronunciationFeedback,
  playIncorrectPronunciationFeedback,
  playSessionCompleteSound,
  isCurrentlyRecording,
  getCurrentRecording,
  clearCurrentRecording,
  stopAllAudio,
  isTTSSupported,
  isRecordingSupported
} from '../infrastructure/ChineseAudio.js';
import { 
  getElementById, 
  updateTextContent, 
  showElement, 
  hideElement, 
  addEventListener, 
  createElement, 
  focusElement, 
  addClass, 
  removeClass 
} from '../infrastructure/UI.js';
import { KEYBOARD_SHORTCUTS } from '../shared/Constants.js';

// Chinese learning state
let chineseSession = null;
let sessionTimer = null;
let autoCloseTimer = null;
let currentRecording = null;
let isModalOpen = false;
let isStartingRecording = false; // Prevent multiple recording starts
let lastRecordingAttempt = 0; // Timestamp of last recording attempt

/**
 * Initialize Chinese learning functionality
 */
export function initializeChinese() {
  setupChineseModal();
  setupChineseControls();
  initializeChineseAudio();
}

/**
 * Setup Chinese modal
 */
function setupChineseModal() {
  const openBtn = getElementById('chineseBtn');
  const modal = getElementById('chineseModal');
  const closeBtn = getElementById('chineseClose');
  
  if (openBtn) {
    addEventListener(openBtn, 'click', showChineseModal);
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', hideChineseModal);
  }
  
  // Modal keydown handler attached to modal itself
  if (modal) {
    addEventListener(modal, 'keydown', handleChineseModalKeydown);
  }
}

/**
 * Setup Chinese controls
 */
function setupChineseControls() {
  const startBtn = getElementById('chineseStart');
  const recordBtn = getElementById('chineseRecord');
  const playBtn = getElementById('chinesePlay');
  const nextBtn = getElementById('chineseNext');
  const prevBtn = getElementById('chinesePrev');
  
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleStartChineseSession);
  }
  
  if (recordBtn) {
    console.log('Adding click listener to record button');
    addEventListener(recordBtn, 'click', handleToggleRecording);
  }
  
  if (playBtn) {
    console.log('Adding click listener to play button');
    addEventListener(playBtn, 'click', handlePlayRecording);
  }
  
  if (nextBtn) {
    addEventListener(nextBtn, 'click', handleNextVocabulary);
  }
  
  if (prevBtn) {
    addEventListener(prevBtn, 'click', handlePrevVocabulary);
  }
}

/**
 * Show Chinese modal
 */
export async function showChineseModal() {
  const modal = getElementById('chineseModal');
  if (!modal) return;
  
  isModalOpen = true;
  addClass(modal, 'show');
  modal.removeAttribute('aria-hidden');
  
  // Make modal focusable for keyboard events
  modal.setAttribute('tabindex', '-1');
  focusElement(modal);
  
  // Focus the close button for accessibility
  const closeBtn = getElementById('chineseClose');
  if (closeBtn) {
    focusElement(closeBtn);
  }
  
  // Check microphone access
  const hasMicrophone = await checkMicrophoneAccess();
  updateMicrophoneStatus(hasMicrophone);
  
  // Check TTS support
  const hasTTS = isTTSSupported();
  updateTTSStatus(hasTTS);
  
  // Start a new session
  await startNewChineseSession();
  
  // Update display
  updateChineseDisplay();
}

/**
 * Hide Chinese modal
 */
function hideChineseModal() {
  const modal = getElementById('chineseModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
    
    // Remove focus from any focused elements inside the modal
    const focusedElement = document.activeElement;
    if (modal.contains(focusedElement)) {
      focusedElement.blur();
    }
  }
  
  isModalOpen = false;
  stopAllAudio();
  clearCurrentSession();
  clearSessionTimers();
}

/**
 * Reset Chinese modal state (exported for global access)
 */
export function resetChineseModal() {
  isModalOpen = false;
  stopAllAudio();
  clearCurrentSession();
  clearSessionTimers();
}

/**
 * Start new Chinese session
 */
async function startNewChineseSession() {
  try {
    chineseSession = startChineseSession();
    updateChineseDisplay();
    startSessionTimer();
    
    // Auto-close after 1 minute
    autoCloseTimer = setTimeout(() => {
      if (isModalOpen) {
        hideChineseModal();
      }
    }, 60000);
    
  } catch (error) {
    console.warn('Failed to start Chinese session:', error);
    showChineseFeedback('Failed to start session');
  }
}

/**
 * Update Chinese display
 */
function updateChineseDisplay() {
  const vocabulary = getCurrentSessionVocabulary();
  if (!vocabulary) return;
  
  // Update vocabulary display
  updateTextContent(getElementById('chineseWord'), vocabulary.word);
  updateTextContent(getElementById('chinesePinyin'), vocabulary.pinyin);
  updateTextContent(getElementById('chineseMeaning'), vocabulary.meaning);
  updateTextContent(getElementById('chineseExample'), vocabulary.example);
  updateTextContent(getElementById('chineseExamplePinyin'), vocabulary.examplePinyin);
  updateTextContent(getElementById('chineseExampleTranslation'), vocabulary.exampleTranslation);
  
  // Update progress
  updateProgressDisplay();
  
  // Update recording status
  updateRecordingStatus();
}

/**
 * Update progress display
 */
function updateProgressDisplay() {
  const stats = getOverallLearningStatsForUser();
  const progressEl = getElementById('chineseProgress');
  
  if (progressEl) {
    updateTextContent(progressEl, `Words learned: ${stats.totalWords} | Accuracy: ${stats.accuracy}%`);
  }
}

/**
 * Update microphone status
 */
function updateMicrophoneStatus(hasAccess) {
  const statusEl = getElementById('chineseMicrophoneStatus');
  if (statusEl) {
    updateTextContent(statusEl, hasAccess ? 'Microphone ready' : 'Microphone access denied');
    addClass(statusEl, hasAccess ? 'success' : 'error');
  }
}

/**
 * Update TTS status
 */
function updateTTSStatus(isSupported) {
  const statusEl = getElementById('chineseTTSStatus');
  if (statusEl) {
    updateTextContent(statusEl, isSupported ? 'TTS ready' : 'TTS not supported');
    addClass(statusEl, isSupported ? 'success' : 'error');
  }
}

/**
 * Update recording status
 */
function updateRecordingStatus() {
  const recordBtn = getElementById('chineseRecord');
  const recordingStatus = getElementById('chineseRecordingStatus');
  const wordSection = getElementById('chineseWord');
  
  const recording = isCurrentlyRecording();
  console.log('updateRecordingStatus called, isRecording:', recording);
  
  if (recording) {
    if (recordBtn) {
      updateTextContent(recordBtn, '🔴 Stop Recording');
      addClass(recordBtn, 'recording');
    }
    if (recordingStatus) {
      updateTextContent(recordingStatus, '🔴 Recording... Speak now!');
      addClass(recordingStatus, 'recording');
    }
    if (wordSection) {
      addClass(wordSection, 'recording-highlight');
    }
  } else {
    if (recordBtn) {
      updateTextContent(recordBtn, '🎤 Start Recording');
      removeClass(recordBtn, 'recording');
    }
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'Ready to record');
      removeClass(recordingStatus, 'recording');
    }
    if (wordSection) {
      removeClass(wordSection, 'recording-highlight');
    }
  }
}

/**
 * Start session timer
 */
function startSessionTimer() {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  
  sessionTimer = setInterval(() => {
    if (!isModalOpen) {
      clearInterval(sessionTimer);
      return;
    }
    
    const remaining = getRemainingSessionTime();
    updateSessionTimer(remaining);
    
    if (remaining <= 0) {
      hideChineseModal();
    }
  }, 1000);
}

/**
 * Update session timer display
 */
function updateSessionTimer(remaining) {
  const timerEl = getElementById('chineseTimer');
  if (timerEl) {
    updateTextContent(timerEl, `${remaining}s remaining`);
    
    if (remaining <= 10) {
      addClass(timerEl, 'warning');
    } else {
      removeClass(timerEl, 'warning');
    }
  }
}

/**
 * Clear session timers
 */
function clearSessionTimers() {
  if (sessionTimer) {
    clearInterval(sessionTimer);
    sessionTimer = null;
  }
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

/**
 * Handle start Chinese session
 */
async function handleStartChineseSession() {
  await startNewChineseSession();
}

/**
 * Handle toggle recording
 */
async function handleToggleRecording() {
  console.log('=== handleToggleRecording called ===');
  console.log('isCurrentlyRecording():', isCurrentlyRecording());
  if (isCurrentlyRecording()) {
    console.log('Stopping recording...');
    await stopRecording();
  } else {
    console.log('Starting recording...');
    await startRecording();
  }
}

/**
 * Start recording
 */
async function startRecording() {
  console.log('=== startRecording called ===');
  if (isCurrentlyRecording()) {
    console.log('Already recording, ignoring request');
    isStartingRecording = false; // Reset flag
    return;
  }
  
  try {
    console.log('Testing microphone access...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted!');
      stream.getTracks().forEach(track => track.stop());
    } catch (micError) {
      console.error('Microphone access denied:', micError);
      showChineseFeedback('Microphone access denied');
      isStartingRecording = false; // Reset flag
      return;
    }
    
    // Start the actual recording
    const success = await startVoiceRecording();
    console.log('startVoiceRecording result:', success);
    
    if (success) {
      // Update UI after successful recording start
      updateRecordingStatus();
      showChineseFeedback('Recording started');
      // Reset flag only after successful recording start
      isStartingRecording = false;
    } else {
      // If recording failed, update UI
      updateRecordingStatus();
      showChineseFeedback('Recording failed');
      // Reset flag after failed attempt
      isStartingRecording = false;
    }
  } catch (error) {
    console.warn('Failed to start recording:', error);
    updateRecordingStatus();
    showChineseFeedback('Recording failed');
    isStartingRecording = false; // Reset flag
  }
}

/**
 * Stop recording
 */
async function stopRecording() {
  console.log('=== stopRecording called ===');
  if (!isCurrentlyRecording()) {
    console.log('Not recording, ignoring request');
    return;
  }
  
  try {
    // Stop the actual recording
    const recording = await stopVoiceRecording();
    
    // Update UI after stopping
    updateRecordingStatus();
    showChineseFeedback('Recording stopped');
    
    if (recording) {
      currentRecording = recording;
      showChineseFeedback('Recording completed');
      
      // Auto-play after 2 seconds
      setTimeout(async () => {
        await playRecordedAudio(recording.url);
      }, 2000);
    } else {
      showChineseFeedback('Failed to stop recording');
    }
  } catch (error) {
    console.warn('Failed to stop recording:', error);
    updateRecordingStatus();
    showChineseFeedback('Recording failed');
  }
}

/**
 * Handle play recording
 */
async function handlePlayRecording() {
  console.log('handlePlayRecording called, currentRecording:', !!currentRecording);
  if (currentRecording) {
    const playBtn = getElementById('chinesePlay');
    if (playBtn) {
      updateTextContent(playBtn, '🔊 Playing...');
      addClass(playBtn, 'playing');
    }
    
    showPlaybackFeedback();
    await playRecordedAudio(currentRecording.url);
    hidePlaybackFeedback();
    
    if (playBtn) {
      updateTextContent(playBtn, '🔊 Play Recording');
      removeClass(playBtn, 'playing');
    }
  } else {
    showChineseFeedback('No recording to play');
  }
}

/**
 * Handle replay recording
 */
async function handleReplayRecording() {
  console.log('handleReplayRecording called, currentRecording:', !!currentRecording);
  if (currentRecording) {
    const playBtn = getElementById('chinesePlay');
    if (playBtn) {
      updateTextContent(playBtn, '🔊 Playing...');
      addClass(playBtn, 'playing');
    }
    
    showPlaybackFeedback();
    await playRecordedAudio(currentRecording.url);
    hidePlaybackFeedback();
    
    if (playBtn) {
      updateTextContent(playBtn, '🔊 Play Recording');
      removeClass(playBtn, 'playing');
    }
  } else {
    showChineseFeedback('No recording to replay');
  }
}

/**
 * Handle random word
 */
async function handleRandomWord() {
  if (!chineseSession) {
    await startNewChineseSession();
  }
  
  const randomVocabulary = getRandomVocabulary();
  if (randomVocabulary) {
    chineseSession.currentWordId = randomVocabulary.id;
    updateChineseDisplay();
    showChineseFeedback('Random word selected');
  }
}

/**
 * Handle next vocabulary
 */
async function handleNextVocabulary() {
  if (!chineseSession) {
    await startNewChineseSession();
    return;
  }
  
  const nextVocabulary = getNextVocabulary(chineseSession.currentWordId);
  if (nextVocabulary) {
    chineseSession.currentWordId = nextVocabulary.id;
    updateChineseDisplay();
    showChineseFeedback('Next word');
  } else {
    showChineseFeedback('No more words');
  }
}

/**
 * Handle previous vocabulary
 */
async function handlePrevVocabulary() {
  if (!chineseSession) {
    await startNewChineseSession();
    return;
  }
  
  const prevVocabulary = getPrevVocabulary(chineseSession.currentWordId);
  if (prevVocabulary) {
    chineseSession.currentWordId = prevVocabulary.id;
    updateChineseDisplay();
    showChineseFeedback('Previous word');
  } else {
    showChineseFeedback('No previous words');
  }
}

/**
 * Handle Chinese modal keydown events
 */
function handleChineseModalKeydown(ev) {
  const modal = getElementById('chineseModal');
  if (!modal || !modal.classList.contains('show')) return;
  
  const key = (ev.key || '').toLowerCase();
  
  
  // If typing in an input inside modal, don't hijack
  const t = ev.target;
  const tag = (t && t.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return;
  
  // Spacebar to toggle recording
  if (ev.key === ' ') {
    ev.preventDefault();
    console.log('Spacebar pressed in Chinese modal');
    handleToggleRecording();
    return;
  }
  
  // A to replay last recording
  if (key === 'a') {
    ev.preventDefault();
    handleReplayRecording();
    return;
  }
  
  // W to speak the word
  if (key === 'w') {
    ev.preventDefault();
    speakCurrentWord();
    return;
  }
  
  // S to speak the sentence only
  if (key === 's') {
    ev.preventDefault();
    speakCurrentSentenceOnly();
    return;
  }
  
  // R for random word
  if (key === 'r') {
    ev.preventDefault();
    handleRandomWord();
    return;
  }
  
  // N for next word
  if (key === 'n') {
    ev.preventDefault();
    handleNextVocabulary();
    return;
  }
  
  // P for previous word
  if (key === 'p') {
    ev.preventDefault();
    handlePrevVocabulary();
    return;
  }
  
}


/**
 * Speak current word
 */
async function speakCurrentWord() {
  const vocabulary = getCurrentSessionVocabulary();
  if (!vocabulary) return;
  
  try {
    showSpeakingFeedback('Speaking word...');
    await speakChineseWordOnly(vocabulary.word);
    hideSpeakingFeedback();
  } catch (error) {
    console.warn('Failed to speak word:', error);
    showChineseFeedback('Failed to speak word');
    hideSpeakingFeedback();
  }
}

/**
 * Speak current sentence only
 */
async function speakCurrentSentenceOnly() {
  const vocabulary = getCurrentSessionVocabulary();
  if (!vocabulary) return;
  
  try {
    showSpeakingFeedback('Speaking sentence...');
    await speakChineseSentenceOnly(vocabulary.example);
    hideSpeakingFeedback();
  } catch (error) {
    console.warn('Failed to speak sentence:', error);
    showChineseFeedback('Failed to speak sentence');
    hideSpeakingFeedback();
  }
}

/**
 * Speak current sentence
 */
async function speakCurrentSentence() {
  const vocabulary = getCurrentSessionVocabulary();
  if (!vocabulary) return;
  
  try {
    showSpeakingFeedback('Speaking sentence...');
    await speakChineseSentenceOnly(vocabulary.example);
    hideSpeakingFeedback();
  } catch (error) {
    console.warn('Failed to speak sentence:', error);
    showChineseFeedback('Failed to speak sentence');
    hideSpeakingFeedback();
  }
}

/**
 * Show Chinese feedback message
 */
function showChineseFeedback(message) {
  // Remove any existing feedback
  const existingFeedback = getElementById('chineseFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create new feedback element
  const feedbackEl = createElement('div', {
    id: 'chineseFeedback',
    className: 'chinese-feedback',
    style: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#065f46',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: '600',
      zIndex: '10001',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    }
  });
  
  updateTextContent(feedbackEl, message);
  
  // Add to modal
  const modal = getElementById('chineseModal');
  if (modal) {
    modal.appendChild(feedbackEl);
    
    // Show feedback with slight delay
    setTimeout(() => {
      addClass(feedbackEl, 'show');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
      removeClass(feedbackEl, 'show');
      setTimeout(() => {
        if (feedbackEl.parentNode) {
          feedbackEl.remove();
        }
      }, 300);
    }, 1500);
  }
}

/**
 * Get Chinese modal element
 * @returns {HTMLElement|null} Modal element
 */
export function getChineseModal() {
  return getElementById('chineseModal');
}

/**
 * Check if Chinese modal is open
 * @returns {boolean} True if modal is open
 */
export function isChineseModalOpen() {
  return isModalOpen;
}

/**
 * Show speaking feedback
 */
function showSpeakingFeedback(message) {
  const wordSection = getElementById('chineseWord');
  const pinyinSection = getElementById('chinesePinyin');
  
  if (wordSection) {
    addClass(wordSection, 'speaking-highlight');
  }
  if (pinyinSection) {
    addClass(pinyinSection, 'speaking-highlight');
  }
  
  showChineseFeedback(`🔊 ${message}`);
}

/**
 * Hide speaking feedback
 */
function hideSpeakingFeedback() {
  const wordSection = getElementById('chineseWord');
  const pinyinSection = getElementById('chinesePinyin');
  
  if (wordSection) {
    removeClass(wordSection, 'speaking-highlight');
  }
  if (pinyinSection) {
    removeClass(pinyinSection, 'speaking-highlight');
  }
}

/**
 * Show playback feedback
 */
function showPlaybackFeedback() {
  const wordSection = getElementById('chineseWord');
  const pinyinSection = getElementById('chinesePinyin');
  
  if (wordSection) {
    addClass(wordSection, 'playback-highlight');
  }
  if (pinyinSection) {
    addClass(pinyinSection, 'playback-highlight');
  }
  
  showChineseFeedback('🔊 Playing your recording...');
}

/**
 * Hide playback feedback
 */
function hidePlaybackFeedback() {
  const wordSection = getElementById('chineseWord');
  const pinyinSection = getElementById('chinesePinyin');
  
  if (wordSection) {
    removeClass(wordSection, 'playback-highlight');
  }
  if (pinyinSection) {
    removeClass(pinyinSection, 'playback-highlight');
  }
}
