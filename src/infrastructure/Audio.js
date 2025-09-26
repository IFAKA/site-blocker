/**
 * Infrastructure layer for Audio operations
 * Handles audio playback and sound effects
 */

import { AUDIO_CONFIG } from '../shared/Constants.js';

/**
 * Play a beep sound
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise<boolean>} Success status
 */
export function playBeep(frequency = AUDIO_CONFIG.BEEP_FREQUENCY, duration = AUDIO_CONFIG.BEEP_DURATION) {
  return new Promise((resolve) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        ctx.close();
        resolve(true);
      }, duration + 60);
      
    } catch (error) {
      console.warn('Failed to play beep:', error);
      resolve(false);
    }
  });
}

/**
 * Play success beep sound
 * @returns {Promise<boolean>} Success status
 */
export function playSuccessBeep() {
  return playBeep(AUDIO_CONFIG.SUCCESS_FREQUENCY, AUDIO_CONFIG.SUCCESS_DURATION);
}

/**
 * Play error beep sound
 * @returns {Promise<boolean>} Success status
 */
export function playErrorBeep() {
  return playBeep(AUDIO_CONFIG.ERROR_FREQUENCY, AUDIO_CONFIG.ERROR_DURATION);
}

/**
 * Play exercise completion sound (double beep)
 * @returns {Promise<boolean>} Success status
 */
export function playExerciseCompleteBeep() {
  return playSuccessBeep().then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        playBeep(900, 260).then(resolve);
      }, 260);
    });
  });
}

/**
 * Play prayer completion sound
 * @returns {Promise<boolean>} Success status
 */
export function playPrayerCompleteBeep() {
  return playExerciseCompleteBeep();
}

/**
 * Play reading completion sound
 * @returns {Promise<boolean>} Success status
 */
export function playReadingCompleteBeep() {
  return playExerciseCompleteBeep();
}

/**
 * Check if audio context is supported
 * @returns {boolean} True if audio is supported
 */
export function isAudioSupported() {
  return !!(window.AudioContext || window.webkitAudioContext);
}

/**
 * Create audio context (for user interaction requirement)
 * @returns {AudioContext|null} Audio context or null
 */
export function createAudioContext() {
  try {
    return new (window.AudioContext || window.webkitAudioContext)();
  } catch (error) {
    console.warn('Failed to create audio context:', error);
    return null;
  }
}

/**
 * Resume audio context if suspended
 * @param {AudioContext} ctx - Audio context
 * @returns {Promise<boolean>} Success status
 */
export function resumeAudioContext(ctx) {
  if (!ctx) return Promise.resolve(false);
  
  if (ctx.state === 'suspended') {
    return ctx.resume().then(() => true).catch(() => false);
  }
  
  return Promise.resolve(true);
}

/**
 * Play eye health focus start sound
 * @returns {Promise<boolean>} Success status
 */
export function playEyeHealthFocusStart() {
  return playBeep(440, 200);
}

/**
 * Play eye health movement start sound
 * @returns {Promise<boolean>} Success status
 */
export function playEyeHealthMovementStart() {
  return playBeep(550, 200);
}

/**
 * Play eye health breathing start sound
 * @returns {Promise<boolean>} Success status
 */
export function playEyeHealthBreathingStart() {
  return playBeep(660, 200);
}

/**
 * Play eye health relaxation start sound
 * @returns {Promise<boolean>} Success status
 */
export function playEyeHealthRelaxationStart() {
  return playBeep(330, 200);
}

/**
 * Play eye health phase transition sound
 * @returns {Promise<boolean>} Success status
 */
export function playEyeHealthPhaseTransition() {
  return playBeep(880, 150);
}

/**
 * Play eye health completion sound
 * @returns {Promise<boolean>} Success status
 */
export function playEyeHealthComplete() {
  return playExerciseCompleteBeep();
}

/**
 * Play breathing cue sound (gentle tone)
 * @returns {Promise<boolean>} Success status
 */
export function playBreathingCue() {
  return playBeep(220, 100);
}

/**
 * Play mind exercise start sound
 * @returns {Promise<boolean>} Success status
 */
export function playMindExerciseStart() {
  return playBeep(660, 200);
}

/**
 * Play mind exercise correct answer sound
 * @returns {Promise<boolean>} Success status
 */
export function playMindCorrectAnswer() {
  return playBeep(880, 150).then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        playBeep(1100, 150).then(resolve);
      }, 100);
    });
  });
}

/**
 * Play mind exercise wrong answer sound
 * @returns {Promise<boolean>} Success status
 */
export function playMindWrongAnswer() {
  return playBeep(440, 200);
}

/**
 * Play mind exercise hint sound
 * @returns {Promise<boolean>} Success status
 */
export function playMindHint() {
  return playBeep(550, 100);
}

/**
 * Play mind exercise timer warning sound
 * @returns {Promise<boolean>} Success status
 */
export function playMindTimerWarning() {
  return playBeep(330, 300);
}

/**
 * Play mind exercise completion sound
 * @returns {Promise<boolean>} Success status
 */
export function playMindComplete() {
  return playBeep(880, 200).then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        playBeep(1100, 200).then(() => {
          return new Promise(resolve2 => {
            setTimeout(() => {
              playBeep(1320, 300).then(resolve2);
            }, 150);
          });
        });
      }, 200);
    });
  });
}

/**
 * Play Chinese learning start sound
 * @returns {Promise<boolean>} Success status
 */
export function playChineseLearningStart() {
  return playBeep(660, 200);
}

/**
 * Play Chinese recording start sound
 * @returns {Promise<boolean>} Success status
 */
export function playChineseRecordingStart() {
  return playBeep(880, 150);
}

/**
 * Play Chinese recording stop sound
 * @returns {Promise<boolean>} Success status
 */
export function playChineseRecordingStop() {
  return playBeep(440, 150);
}

/**
 * Play Chinese playback sound
 * @returns {Promise<boolean>} Success status
 */
export function playChinesePlayback() {
  return playBeep(550, 100);
}

/**
 * Play Chinese session complete sound
 * @returns {Promise<boolean>} Success status
 */
export function playChineseSessionComplete() {
  return playBeep(880, 200).then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        playBeep(1100, 200).then(() => {
          return new Promise(resolve2 => {
            setTimeout(() => {
              playBeep(1320, 300).then(resolve2);
            }, 150);
          });
        });
      }, 200);
    });
  });
}

/**
 * Play Chinese pronunciation sound
 * @returns {Promise<boolean>} Success status
 */
export function playChinesePronunciation() {
  return playBeep(660, 100);
}

/**
 * Play Chinese feedback sound (correct)
 * @returns {Promise<boolean>} Success status
 */
export function playChineseCorrect() {
  return playBeep(880, 150).then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        playBeep(1100, 150).then(resolve);
      }, 100);
    });
  });
}

/**
 * Play Chinese feedback sound (incorrect)
 * @returns {Promise<boolean>} Success status
 */
export function playChineseIncorrect() {
  return playBeep(440, 200);
}
