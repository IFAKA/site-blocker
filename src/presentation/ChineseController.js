/**
 * Presentation layer for Chinese Language Learning UI
 * Handles Chinese learning interface and user interactions
 */

import { 
  getElementById, 
  updateTextContent, 
  showElement, 
  hideElement, 
  addEventListener, 
  addClass, 
  removeClass 
} from '../infrastructure/UI.js';

// Chinese learning state
let currentWord = null;
let currentSession = null;
let isRecording = false;
let recordingStartTime = null;
let sessionStartTime = null;
let sessionDuration = 60; // 60 seconds
let wordsLearned = 0;
let correctAttempts = 0;
let totalAttempts = 0;

// Audio state
let mediaRecorder = null;
let audioChunks = [];
let currentRecording = null;
let speechSynthesis = window.speechSynthesis;
let voices = [];
let selectedVoice = null;
let currentAudio = null; // Reference to currently playing audio

// Sample vocabulary data
const vocabulary = [
  {
    word: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Hello',
    example: '你好，很高兴认识你。',
    examplePinyin: 'nǐ hǎo, hěn gāo xìng rèn shi nǐ.',
    exampleTranslation: 'Hello, nice to meet you.'
  },
  {
    word: '谢谢',
    pinyin: 'xiè xiè',
    meaning: 'Thank you',
    example: '谢谢你的帮助。',
    examplePinyin: 'xiè xiè nǐ de bāng zhù.',
    exampleTranslation: 'Thank you for your help.'
  },
  {
    word: '再见',
    pinyin: 'zài jiàn',
    meaning: 'Goodbye',
    example: '再见，明天见。',
    examplePinyin: 'zài jiàn, míng tiān jiàn.',
    exampleTranslation: 'Goodbye, see you tomorrow.'
  },
  {
    word: '对不起',
    pinyin: 'duì bù qǐ',
    meaning: 'Sorry',
    example: '对不起，我迟到了。',
    examplePinyin: 'duì bù qǐ, wǒ chí dào le.',
    exampleTranslation: 'Sorry, I am late.'
  },
  {
    word: '没关系',
    pinyin: 'méi guān xi',
    meaning: 'It\'s okay',
    example: '没关系，不用谢。',
    examplePinyin: 'méi guān xi, bù yòng xiè.',
    exampleTranslation: 'It\'s okay, no need to thank me.'
  }
];

/**
 * Initialize Chinese modal
 */
export function initializeChinese() {
  setupChineseModal();
  setupChineseControls();
  initializeAudio();
}

/**
 * Setup Chinese modal
 */
function setupChineseModal() {
  const modal = getElementById('chineseModal');
  const closeBtn = getElementById('chineseClose');
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', hideChineseModal);
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
    addEventListener(startBtn, 'click', startNewSession);
  }
  
  if (recordBtn) {
    addEventListener(recordBtn, 'click', toggleRecording);
  }
  
  if (playBtn) {
    addEventListener(playBtn, 'click', playRecording);
  }
  
  if (nextBtn) {
    addEventListener(nextBtn, 'click', nextWord);
  }
  
  if (prevBtn) {
    addEventListener(prevBtn, 'click', prevWord);
  }
}

/**
 * Initialize audio capabilities
 */
async function initializeAudio() {
  try {
    // Load voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        // Try to find a Chinese voice
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('zh') || 
          voice.name.toLowerCase().includes('chinese') ||
          voice.name.toLowerCase().includes('mandarin')
        ) || voices[0];
        
        updateAudioStatus();
      };
    }
    
    // Check microphone access
    await checkMicrophoneAccess();
    updateAudioStatus();
  } catch (error) {
    console.error('Audio initialization failed:', error);
    updateAudioStatus('Audio initialization failed');
  }
}

/**
 * Check microphone access
 */
async function checkMicrophoneAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone access denied:', error);
    return false;
  }
}

/**
 * Stop all audio playback
 */
function stopAllAudio() {
  // Stop any playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  
  // Stop any TTS
  speechSynthesis.cancel();
}

/**
 * Update audio status
 */
function updateAudioStatus(message = null) {
  const micStatus = getElementById('chineseMicrophoneStatus');
  const ttsStatus = getElementById('chineseTTSStatus');
  
  if (micStatus) {
    updateTextContent(micStatus, message || 'Microphone ready');
  }
  
  if (ttsStatus) {
    const voiceInfo = selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'TTS ready';
    updateTextContent(ttsStatus, message || voiceInfo);
  }
}

/**
 * Show Chinese modal
 */
export function showChineseModal() {
  const modal = getElementById('chineseModal');
  if (!modal) return;
  
  addClass(modal, 'show');
  modal.removeAttribute('aria-hidden');
  
  // Initialize with first word
  if (!currentWord) {
    currentWord = vocabulary[0];
    updateWordDisplay();
  }
  
  updateStats();
  updateTimer();
  updateAudioStatus();
}

/**
 * Hide Chinese modal
 */
export function hideChineseModal() {
  const modal = getElementById('chineseModal');
  if (modal) {
    removeClass(modal, 'show');
    modal.setAttribute('aria-hidden', 'true');
  }
  
  // Stop any ongoing recording
  if (isRecording) {
    stopRecording();
  }
}

/**
 * Start new session
 */
function startNewSession() {
  currentSession = {
    startTime: Date.now(),
    words: [...vocabulary],
    currentIndex: 0
  };
  
  sessionStartTime = Date.now();
  wordsLearned = 0;
  correctAttempts = 0;
  totalAttempts = 0;
  
  // Start with first word
  currentWord = vocabulary[0];
  updateWordDisplay();
  updateStats();
  updateTimer();
  
  // Start session timer
  startSessionTimer();
}

/**
 * Update word display
 */
function updateWordDisplay() {
  if (!currentWord) return;
  
  const wordEl = getElementById('chineseWord');
  const pinyinEl = getElementById('chinesePinyin');
  const meaningEl = getElementById('chineseMeaning');
  const exampleEl = getElementById('chineseExample');
  const examplePinyinEl = getElementById('chineseExamplePinyin');
  const exampleTranslationEl = getElementById('chineseExampleTranslation');
  
  if (wordEl) updateTextContent(wordEl, currentWord.word);
  if (pinyinEl) updateTextContent(pinyinEl, currentWord.pinyin);
  if (meaningEl) updateTextContent(meaningEl, currentWord.meaning);
  if (exampleEl) updateTextContent(exampleEl, currentWord.example);
  if (examplePinyinEl) updateTextContent(examplePinyinEl, currentWord.examplePinyin);
  if (exampleTranslationEl) updateTextContent(exampleTranslationEl, currentWord.exampleTranslation);
}

/**
 * Next word
 */
function nextWord() {
  if (!currentSession) {
    startNewSession();
    return;
  }
  
  const currentIndex = currentSession.currentIndex;
  if (currentIndex < currentSession.words.length - 1) {
    currentSession.currentIndex++;
    currentWord = currentSession.words[currentSession.currentIndex];
    updateWordDisplay();
  } else {
    // End of session
    completeSession();
  }
}

/**
 * Previous word
 */
function prevWord() {
  if (!currentSession || currentSession.currentIndex <= 0) return;
  
  currentSession.currentIndex--;
  currentWord = currentSession.words[currentSession.currentIndex];
  updateWordDisplay();
}

/**
 * Random word
 */
function randomWord() {
  if (!currentSession) {
    startNewSession();
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * currentSession.words.length);
  currentSession.currentIndex = randomIndex;
  currentWord = currentSession.words[randomIndex];
  updateWordDisplay();
}

/**
 * Toggle recording
 */
function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

/**
 * Start recording
 */
async function startRecording() {
  if (isRecording) return;
  
  // Stop all audio before starting recording
  stopAllAudio();
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      currentRecording = URL.createObjectURL(audioBlob);
      
      const recordingStatus = getElementById('chineseRecordingStatus');
      if (recordingStatus) {
        updateTextContent(recordingStatus, 'Recording saved');
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.start();
    isRecording = true;
    recordingStartTime = Date.now();
    
    const recordBtn = getElementById('chineseRecord');
    const recordingStatus = getElementById('chineseRecordingStatus');
    
    if (recordBtn) {
      updateTextContent(recordBtn, '⏹️ Stop Recording');
      addClass(recordBtn, 'recording');
    }
    
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'Recording...');
    }
    
    console.log('Started recording for word:', currentWord?.word);
  } catch (error) {
    console.error('Failed to start recording:', error);
    updateAudioStatus('Microphone access denied');
  }
}

/**
 * Stop recording
 */
function stopRecording() {
  if (!isRecording || !mediaRecorder) return;
  
  mediaRecorder.stop();
  isRecording = false;
  
  const recordBtn = getElementById('chineseRecord');
  const recordingStatus = getElementById('chineseRecordingStatus');
  
  if (recordBtn) {
    updateTextContent(recordBtn, '🎤 Start Recording');
    removeClass(recordBtn, 'recording');
  }
  
  if (recordingStatus) {
    const recordingDuration = Date.now() - recordingStartTime;
    updateTextContent(recordingStatus, `Recorded for ${Math.round(recordingDuration / 1000)}s`);
  }
  
  console.log('Stopped recording for word:', currentWord?.word);
}

/**
 * Play recording
 */
function playRecording() {
  if (!currentRecording) {
    const recordingStatus = getElementById('chineseRecordingStatus');
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'No recording to play');
    }
    return;
  }
  
  console.log('Playing recording for word:', currentWord?.word);
  
  // Stop any currently playing audio first
  stopAllAudio();
  
  const audio = new Audio(currentRecording);
  currentAudio = audio; // Store reference
  const recordingStatus = getElementById('chineseRecordingStatus');
  
  if (recordingStatus) {
    updateTextContent(recordingStatus, 'Playing recording...');
  }
  
  audio.onended = () => {
    currentAudio = null; // Clear reference when done
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'Recording played');
    }
  };
  
  audio.onerror = () => {
    currentAudio = null; // Clear reference on error
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'Error playing recording');
    }
  };
  
  audio.play();
}

/**
 * Speak current word
 */
function speakCurrentWord() {
  if (!currentWord) return;
  
  console.log('Speaking word:', currentWord.word);
  
  // Stop any currently playing audio first
  stopAllAudio();
  
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;
  utterance.pitch = 1;
  
  const recordingStatus = getElementById('chineseRecordingStatus');
  if (recordingStatus) {
    updateTextContent(recordingStatus, 'Speaking word...');
  }
  
  utterance.onend = () => {
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'Word spoken');
    }
  };
  
  utterance.onerror = () => {
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'TTS error');
    }
  };
  
  speechSynthesis.speak(utterance);
}

/**
 * Speak current sentence
 */
function speakCurrentSentence() {
  if (!currentWord) return;
  
  console.log('Speaking sentence:', currentWord.example);
  
  // Stop any currently playing audio first
  stopAllAudio();
  
  const utterance = new SpeechSynthesisUtterance(currentWord.example);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.lang = 'zh-CN';
  utterance.rate = 0.7;
  utterance.pitch = 1;
  
  const recordingStatus = getElementById('chineseRecordingStatus');
  if (recordingStatus) {
    updateTextContent(recordingStatus, 'Speaking sentence...');
  }
  
  utterance.onend = () => {
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'Sentence spoken');
    }
  };
  
  utterance.onerror = () => {
    if (recordingStatus) {
      updateTextContent(recordingStatus, 'TTS error');
    }
  };
  
  speechSynthesis.speak(utterance);
}

/**
 * Update stats
 */
function updateStats() {
  const progressEl = getElementById('chineseProgress');
  if (progressEl) {
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    updateTextContent(progressEl, `Words learned: ${wordsLearned} | Accuracy: ${accuracy}%`);
  }
}

/**
 * Update timer
 */
function updateTimer() {
  const timerEl = getElementById('chineseTimer');
  if (!timerEl || !sessionStartTime) return;
  
  const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
  const remaining = Math.max(0, sessionDuration - elapsed);
  
  updateTextContent(timerEl, `${remaining}s remaining`);
  
  if (remaining === 0) {
    completeSession();
  }
}

/**
 * Start session timer
 */
function startSessionTimer() {
  const timerInterval = setInterval(() => {
    if (!currentSession) {
      clearInterval(timerInterval);
      return;
    }
    
    updateTimer();
  }, 1000);
}

/**
 * Complete session
 */
function completeSession() {
  console.log('Session completed!');
  
  const recordingStatus = getElementById('chineseRecordingStatus');
  if (recordingStatus) {
    updateTextContent(recordingStatus, 'Session completed!');
  }
  
  // Reset session
  currentSession = null;
  sessionStartTime = null;
}

/**
 * Handle Chinese modal keydown events
 */
export function handleChineseModalKeydown(ev) {
  const modal = getElementById('chineseModal');
  if (!modal || !modal.classList.contains('show')) return false;
  
  const key = (ev.key || '').toLowerCase();
  
  // If typing in an input inside modal, don't hijack
  const t = ev.target;
  const tag = (t && t.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return false;
  
  // Spacebar to toggle recording
  if (ev.key === ' ' || ev.key === 'Space') {
    ev.preventDefault();
    toggleRecording();
    return true;
  }
  
  // W to speak the word
  if (key === 'w') {
    ev.preventDefault();
    speakCurrentWord();
    return true;
  }
  
  // S to speak the sentence
  if (key === 's') {
    ev.preventDefault();
    speakCurrentSentence();
    return true;
  }
  
  // R for random word
  if (key === 'r') {
    ev.preventDefault();
    randomWord();
    return true;
  }
  
  // N for next word
  if (key === 'n') {
    ev.preventDefault();
    nextWord();
    return true;
  }
  
  // P for previous word
  if (key === 'p') {
    ev.preventDefault();
    prevWord();
    return true;
  }
  
  // A to play recording
  if (key === 'a') {
    ev.preventDefault();
    playRecording();
    return true;
  }
  
  // Return false for unhandled keys
  return false;
}

/**
 * Get Chinese modal element
 */
export function getChineseModal() {
  return getElementById('chineseModal');
}

/**
 * Check if Chinese modal is open
 */
export function isChineseModalOpen() {
  const modal = getChineseModal();
  return modal && modal.classList.contains('show');
}

/**
 * Reset Chinese modal
 */
export function resetChineseModal() {
  currentWord = null;
  currentSession = null;
  isRecording = false;
  recordingStartTime = null;
  sessionStartTime = null;
  wordsLearned = 0;
  correctAttempts = 0;
  totalAttempts = 0;
  
  // Clean up audio resources
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  
  if (currentRecording) {
    URL.revokeObjectURL(currentRecording);
    currentRecording = null;
  }
  
  // Stop all audio
  stopAllAudio();
}