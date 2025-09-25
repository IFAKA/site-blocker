/**
 * Application layer for Eye Health operations
 * Business logic for eye health management
 */

import { 
  getEyeHealthRoutine, 
  createFlatEyeHealthArray, 
  calculateEyeHealthProgress, 
  getEyeHealthInfo, 
  calculateEyeHealthTiming,
  getBreathingPattern,
  calculateBreathingCycle
} from '../domain/EyeHealth.js';
import { getItem, setItem } from '../infrastructure/Storage.js';

const EYE_HEALTH_INDEX_KEY = 'site-blocker:eye-health:index';

/**
 * Get the complete eye health routine
 * @returns {Array} Eye health routine array
 */
export function getRoutine() {
  return getEyeHealthRoutine();
}

/**
 * Get flat eye health array
 * @returns {Array} Flat array of eye health phases
 */
export function getFlatEyeHealthArray() {
  const routine = getRoutine();
  return createFlatEyeHealthArray(routine);
}

/**
 * Get current eye health index
 * @returns {number} Current eye health index
 */
export function getCurrentEyeHealthIndex() {
  const stored = getItem(EYE_HEALTH_INDEX_KEY);
  return stored !== null ? parseInt(stored, 10) : 0;
}

/**
 * Set current eye health index
 * @param {number} index - Eye health index
 * @returns {boolean} Success status
 */
export function setCurrentEyeHealthIndex(index) {
  const flatArray = getFlatEyeHealthArray();
  const clampedIndex = Math.max(0, Math.min(flatArray.length - 1, index));
  return setItem(EYE_HEALTH_INDEX_KEY, clampedIndex.toString());
}

/**
 * Get next eye health index
 * @returns {number} Next eye health index
 */
export function getNextEyeHealthIndex() {
  const currentIndex = getCurrentEyeHealthIndex();
  const flatArray = getFlatEyeHealthArray();
  return (currentIndex + 1) % flatArray.length;
}

/**
 * Move to next eye health phase
 * @returns {boolean} Success status
 */
export function moveToNextEyeHealthPhase() {
  const nextIndex = getNextEyeHealthIndex();
  return setCurrentEyeHealthIndex(nextIndex);
}

/**
 * Reset eye health cycle to beginning
 * @returns {boolean} Success status
 */
export function resetEyeHealthCycle() {
  return setCurrentEyeHealthIndex(0);
}

/**
 * Get current eye health information
 * @returns {Object|null} Current eye health info
 */
export function getCurrentEyeHealthInfo() {
  const currentIndex = getCurrentEyeHealthIndex();
  const flatArray = getFlatEyeHealthArray();
  const routine = getRoutine();
  
  return getEyeHealthInfo(currentIndex, flatArray, routine);
}

/**
 * Get eye health progress information
 * @returns {Object} Progress information
 */
export function getEyeHealthProgress() {
  const currentIndex = getCurrentEyeHealthIndex();
  const flatArray = getFlatEyeHealthArray();
  return calculateEyeHealthProgress(currentIndex, flatArray.length);
}

/**
 * Get eye health timing for current phase
 * @returns {Object} Timing information
 */
export function getCurrentEyeHealthTiming() {
  const currentInfo = getCurrentEyeHealthInfo();
  if (!currentInfo) return null;
  
  return calculateEyeHealthTiming(parseInt(currentInfo.subtitle, 10));
}

/**
 * Check if eye health cycle is complete
 * @returns {boolean} True if cycle is complete
 */
export function isEyeHealthCycleComplete() {
  const progress = getEyeHealthProgress();
  return progress.isComplete;
}

/**
 * Get eye health statistics
 * @returns {Object} Eye health statistics
 */
export function getEyeHealthStatistics() {
  const flatArray = getFlatEyeHealthArray();
  const currentIndex = getCurrentEyeHealthIndex();
  
  const totalPhases = flatArray.length;
  const completedPhases = currentIndex;
  const remainingPhases = totalPhases - currentIndex;
  
  const totalDuration = flatArray.reduce((sum, item) => sum + item.duration, 0);
  const completedDuration = flatArray.slice(0, currentIndex).reduce((sum, item) => sum + item.duration, 0);
  const remainingDuration = totalDuration - completedDuration;
  
  return {
    totalPhases,
    completedPhases,
    remainingPhases,
    totalDuration,
    completedDuration,
    remainingDuration,
    progressPercentage: Math.round((completedPhases / totalPhases) * 100)
  };
}

/**
 * Get breathing pattern information
 * @returns {Object} Breathing pattern
 */
export function getBreathingPatternInfo() {
  return getBreathingPattern();
}

/**
 * Calculate breathing cycle for current time
 * @param {number} secondsElapsed - Seconds elapsed in breathing phase
 * @returns {Object} Breathing cycle information
 */
export function getBreathingCycleInfo(secondsElapsed) {
  return calculateBreathingCycle(secondsElapsed);
}

/**
 * Start eye health session
 * @returns {Object} Session information
 */
export function startEyeHealthSession() {
  const currentInfo = getCurrentEyeHealthInfo();
  const progress = getEyeHealthProgress();
  const timing = getCurrentEyeHealthTiming();
  
  return {
    currentInfo,
    progress,
    timing,
    startTime: Date.now(),
    isActive: true
  };
}

/**
 * End eye health session
 * @returns {Object} Session end information
 */
export function endEyeHealthSession() {
  const statistics = getEyeHealthStatistics();
  const endTime = Date.now();
  
  return {
    statistics,
    endTime,
    isActive: false
  };
}
