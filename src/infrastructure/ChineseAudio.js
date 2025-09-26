/**
 * Infrastructure layer for Chinese Language Audio operations
 * Handles Text-to-Speech, voice recording, and audio playback for Chinese learning
 */

import { 
  playChineseRecordingStart, 
  playChineseRecordingStop, 
  playChinesePlayback,
  playChinesePronunciation,
  playChineseCorrect,
  playChineseIncorrect,
  playChineseSessionComplete,
  createAudioContext,
  resumeAudioContext
} from './Audio.js';
import { getItem, setItem } from './Storage.js';
import { STORAGE_KEYS } from '../shared/Constants.js';

// Audio recording state
let mediaRecorder = null;
let audioChunks = [];
let audioContext = null;
let isRecording = false;
let currentRecording = null;

/**
 * Initialize audio context for Chinese learning
 * @returns {Promise<boolean>} Success status
 */
export async function initializeChineseAudio() {
  try {
    audioContext = createAudioContext();
    if (!audioContext) {
      console.warn('Audio context not supported');
      return false;
    }
    
    await resumeAudioContext(audioContext);
    // Warm up voices list so voiceschanged fires where needed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    return true;
  } catch (error) {
    console.warn('Failed to initialize Chinese audio:', error);
    return false;
  }
}

/**
 * Check if microphone access is available
 * @returns {Promise<boolean>} True if microphone is available
 */
export async function checkMicrophoneAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.warn('Microphone access denied:', error);
    return false;
  }
}

/**
 * Start voice recording
 * @returns {Promise<boolean>} Success status
 */
export async function startVoiceRecording() {
  console.log('=== startVoiceRecording called ===');
  console.log('isRecording:', isRecording);
  
  try {
    if (isRecording) {
      console.log('Already recording, returning false');
      return false;
    }
    
    console.log('Requesting microphone access...');
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    console.log('Microphone access granted');
    
    console.log('Setting up MediaRecorder...');
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      currentRecording = {
        blob: audioBlob,
        url: URL.createObjectURL(audioBlob),
        timestamp: new Date().toISOString()
      };
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    };
    
    console.log('Starting MediaRecorder...');
    mediaRecorder.start();
    isRecording = true;
    console.log('isRecording set to:', isRecording);
    
    console.log('About to play recording start sound...');
    try {
      await playChineseRecordingStart();
      console.log('Recording start sound played');
    } catch (soundError) {
      console.warn('Failed to play recording start sound:', soundError);
      // Continue anyway, don't fail the recording
    }
    
    console.log('=== Returning true ===');
    return true;
  } catch (error) {
    console.warn('Failed to start recording:', error);
    return false;
  }
}

/**
 * Stop voice recording
 * @returns {Promise<Object|null>} Recording data or null
 */
export async function stopVoiceRecording() {
  try {
    if (!isRecording || !mediaRecorder) {
      return null;
    }
    
    mediaRecorder.stop();
    isRecording = false;
    
    await playChineseRecordingStop();
    
    // Wait for the recording to be processed
    return new Promise((resolve) => {
      const checkRecording = () => {
        if (currentRecording) {
          const recording = { ...currentRecording };
          currentRecording = null;
          resolve(recording);
        } else {
          setTimeout(checkRecording, 100);
        }
      };
      checkRecording();
    });
  } catch (error) {
    console.warn('Failed to stop recording:', error);
    isRecording = false;
    return null;
  }
}

/**
 * Play recorded audio
 * @param {string} audioUrl - Audio URL to play
 * @returns {Promise<boolean>} Success status
 */
export async function playRecordedAudio(audioUrl) {
  try {
    if (!audioUrl) {
      return false;
    }
    
    const audio = new Audio(audioUrl);
    audio.volume = 0.8;
    
    await playChinesePlayback();
    
    return new Promise((resolve) => {
      audio.onended = () => resolve(true);
      audio.onerror = () => resolve(false);
      audio.play().catch(() => resolve(false));
    });
  } catch (error) {
    console.warn('Failed to play recorded audio:', error);
    return false;
  }
}

/**
 * Speak Chinese text using Text-to-Speech
 * @param {string} text - Text to speak
 * @param {string} language - Language code (default: 'zh-CN')
 * @param {number} rate - Speech rate (default: 0.8)
 * @param {number} pitch - Speech pitch (default: 1.0)
 * @returns {Promise<boolean>} Success status
 */
export async function speakChineseText(text, language = 'zh-CN', rate = 0.8, pitch = 1.0) {
  try {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return false;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    await playChinesePronunciation();
    
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.9;
      
      // Prefer the best available Chinese voice if present
      try {
        const trySetBestVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            // Preferred user selection from storage
            const preferred = getItem(STORAGE_KEYS.CHINESE_PREFERRED_VOICE, null);
            if (preferred && preferred.name) {
              const match = voices.find(v => v.name === preferred.name || (preferred.lang && v.lang === preferred.lang));
              if (match) {
                utterance.voice = match;
                if (match.lang) utterance.lang = match.lang;
                window.speechSynthesis.speak(utterance);
                return;
              }
            }
            
            // Prefer enhanced Mandarin voices if available
            const preferredNames = [
              'Ting-Ting', 'Mei-Jia', 'Liang', 'Tian-Tian', // macOS
              'Google 普通话（中国大陆）', 'Google 粤語（香港）', 'Google 國語（臺灣）', // Chrome Google voices
              'Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)', // Edge
            ];
            const chineseVoices = voices.filter(v => 
              (v.lang && (v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().includes('cmn'))) ||
              (v.name && (/chinese|普通话|國語|粤|mandarin|putonghua/i).test(v.name))
            );
            const byName = preferredNames
              .map(name => chineseVoices.find(v => v.name === name))
              .find(Boolean);
            const selected = byName || chineseVoices[0] || null;
            if (selected) {
              utterance.voice = selected;
              // Align language with selected voice if present
              if (selected.lang) utterance.lang = selected.lang;
            }
            window.speechSynthesis.speak(utterance);
          } else {
            // Voices not loaded yet; speak anyway with lang fallback
            window.speechSynthesis.speak(utterance);
          }
        };
        // If voices not ready, wait for the event once
        if (window.speechSynthesis.getVoices().length === 0) {
          const onVoices = () => {
            window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
            trySetBestVoice();
          };
          window.speechSynthesis.addEventListener('voiceschanged', onVoices);
          // Also set a short fallback timeout in case event never fires
          setTimeout(() => {
            try {
              window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
            } catch {}
            trySetBestVoice();
          }, 250);
        } else {
          trySetBestVoice();
        }
      } catch {
        window.speechSynthesis.speak(utterance);
      }
      
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
    });
  } catch (error) {
    console.warn('Failed to speak text:', error);
    return false;
  }
}

/**
 * Speak English text using Text-to-Speech
 * @param {string} text - Text to speak
 * @param {string} language - Language code (default: 'en-US')
 * @param {number} rate - Speech rate (default: 1.0)
 * @param {number} pitch - Speech pitch (default: 1.0)
 * @returns {Promise<boolean>} Success status
 */

/**
 * Speak Chinese word with pronunciation
 * @param {string} word - Chinese word
 * @param {string} pinyin - Pinyin pronunciation
 * @returns {Promise<boolean>} Success status
 */
export async function speakChineseWord(word, pinyin) {
  try {
    // Speak the word first
    await speakChineseText(word);
    
    // Wait a moment, then speak the pinyin
    await new Promise(resolve => setTimeout(resolve, 1000));
    await speakChineseText(pinyin, 'zh-CN', 0.7, 1.1);
    
    return true;
  } catch (error) {
    console.warn('Failed to speak Chinese word:', error);
    return false;
  }
}

/**
 * Speak only the Chinese word (no pinyin)
 * @param {string} word - Chinese word
 * @returns {Promise<boolean>} Success status
 */
export async function speakChineseWordOnly(word) {
  try {
    await speakChineseText(word);
    return true;
  } catch (error) {
    console.warn('Failed to speak Chinese word only:', error);
    return false;
  }
}

/**
 * Speak Chinese example sentence
 * @param {string} sentence - Chinese sentence
 * @param {string} pinyin - Pinyin pronunciation
 * @returns {Promise<boolean>} Success status
 */
export async function speakChineseSentence(sentence, pinyin) {
  try {
    // Speak the sentence
    await speakChineseText(sentence, 'zh-CN', 0.6, 1.0);
    
    // Wait a moment, then speak the pinyin
    await new Promise(resolve => setTimeout(resolve, 1500));
    await speakChineseText(pinyin, 'zh-CN', 0.5, 1.1);
    
    return true;
  } catch (error) {
    console.warn('Failed to speak Chinese sentence:', error);
    return false;
  }
}

/**
 * Speak only the Chinese sentence (no pinyin)
 * @param {string} sentence - Chinese sentence
 * @returns {Promise<boolean>} Success status
 */
export async function speakChineseSentenceOnly(sentence) {
  try {
    await speakChineseText(sentence, 'zh-CN', 0.6, 1.0);
    return true;
  } catch (error) {
    console.warn('Failed to speak Chinese sentence only:', error);
    return false;
  }
}

/**
 * Play feedback sound for correct pronunciation
 * @returns {Promise<boolean>} Success status
 */
export async function playCorrectPronunciationFeedback() {
  return playChineseCorrect();
}

/**
 * Play feedback sound for incorrect pronunciation
 * @returns {Promise<boolean>} Success status
 */
export async function playIncorrectPronunciationFeedback() {
  return playChineseIncorrect();
}

/**
 * Play session completion sound
 * @returns {Promise<boolean>} Success status
 */
export async function playSessionCompleteSound() {
  return playChineseSessionComplete();
}

/**
 * Check if currently recording
 * @returns {boolean} True if recording
 */
export function isCurrentlyRecording() {
  console.log('isCurrentlyRecording called, returning:', isRecording);
  return isRecording;
}

/**
 * Get current recording
 * @returns {Object|null} Current recording or null
 */
export function getCurrentRecording() {
  return currentRecording;
}

/**
 * Clear current recording
 */
export function clearCurrentRecording() {
  if (currentRecording && currentRecording.url) {
    URL.revokeObjectURL(currentRecording.url);
  }
  currentRecording = null;
}

/**
 * Stop all audio operations
 */
export function stopAllAudio() {
  try {
    // Stop recording if active
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      isRecording = false;
    }
    
    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Clear current recording
    clearCurrentRecording();
  } catch (error) {
    console.warn('Failed to stop all audio:', error);
  }
}

/**
 * Get available voices for Chinese
 * @returns {Array} Array of available voices
 */
export function getAvailableChineseVoices() {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('zh') || 
    voice.lang.includes('Chinese') ||
    voice.name.includes('Chinese')
  );
}

/**
 * Get the best Chinese voice
 * @returns {SpeechSynthesisVoice|null} Best Chinese voice or null
 */
export function getBestChineseVoice() {
  const chineseVoices = getAvailableChineseVoices();
  
  if (chineseVoices.length === 0) {
    return null;
  }
  
  // Prefer Mandarin Chinese voices
  const mandarinVoices = chineseVoices.filter(voice => 
    voice.lang.includes('zh-CN') || voice.lang.includes('cmn')
  );
  
  if (mandarinVoices.length > 0) {
    return mandarinVoices[0];
  }
  
  return chineseVoices[0];
}

/**
 * Check if TTS is supported
 * @returns {boolean} True if TTS is supported
 */
export function isTTSSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Check if recording is supported
 * @returns {boolean} True if recording is supported
 */
export function isRecordingSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
