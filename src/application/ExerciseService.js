/**
 * Application layer for Exercise operations
 * Business logic for exercise management
 */

import { getExerciseRoutine, createFlatExerciseArray, calculateExerciseProgress, getExerciseInfo, calculateExerciseTiming } from '../domain/Exercise.js';
import { getExerciseIndex, setExerciseIndex } from '../infrastructure/Storage.js';

/**
 * Get the complete exercise routine
 * @returns {Array} Exercise routine array
 */
export function getRoutine() {
  return getExerciseRoutine();
}

/**
 * Get flat exercise array
 * @returns {Array} Flat array of exercise sets
 */
export function getFlatExerciseArray() {
  const routine = getRoutine();
  return createFlatExerciseArray(routine);
}

/**
 * Get current exercise index
 * @returns {number} Current exercise index
 */
export function getCurrentExerciseIndex() {
  return getExerciseIndex();
}

/**
 * Set current exercise index
 * @param {number} index - Exercise index
 * @returns {boolean} Success status
 */
export function setCurrentExerciseIndex(index) {
  const flatArray = getFlatExerciseArray();
  const clampedIndex = Math.max(0, Math.min(flatArray.length - 1, index));
  return setExerciseIndex(clampedIndex);
}

/**
 * Get next exercise index
 * @returns {number} Next exercise index
 */
export function getNextExerciseIndex() {
  const currentIndex = getCurrentExerciseIndex();
  const flatArray = getFlatExerciseArray();
  return (currentIndex + 1) % flatArray.length;
}

/**
 * Move to next exercise
 * @returns {boolean} Success status
 */
export function moveToNextExercise() {
  const nextIndex = getNextExerciseIndex();
  return setCurrentExerciseIndex(nextIndex);
}

/**
 * Reset exercise cycle to beginning
 * @returns {boolean} Success status
 */
export function resetExerciseCycle() {
  return setCurrentExerciseIndex(0);
}

/**
 * Get current exercise information
 * @returns {Object|null} Current exercise info
 */
export function getCurrentExerciseInfo() {
  const currentIndex = getCurrentExerciseIndex();
  const flatArray = getFlatExerciseArray();
  const routine = getRoutine();
  
  return getExerciseInfo(currentIndex, flatArray, routine);
}

/**
 * Get exercise progress information
 * @returns {Object} Progress information
 */
export function getExerciseProgress() {
  const currentIndex = getCurrentExerciseIndex();
  const flatArray = getFlatExerciseArray();
  return calculateExerciseProgress(currentIndex, flatArray.length);
}

/**
 * Get exercise timing for current set
 * @returns {Object} Timing information
 */
export function getCurrentExerciseTiming() {
  const currentInfo = getCurrentExerciseInfo();
  if (!currentInfo) return null;
  
  // Extract reps from subtitle (e.g., "Set 1 of 3 — 10 reps")
  const repsMatch = currentInfo.subtitle.match(/—\s(\d+)\sreps/);
  const reps = repsMatch ? parseInt(repsMatch[1], 10) : 10;
  
  return calculateExerciseTiming(reps);
}

/**
 * Check if exercise cycle is complete
 * @returns {boolean} True if cycle is complete
 */
export function isExerciseCycleComplete() {
  const progress = getExerciseProgress();
  return progress.isComplete;
}

/**
 * Get exercise statistics
 * @returns {Object} Exercise statistics
 */
export function getExerciseStatistics() {
  const flatArray = getFlatExerciseArray();
  const currentIndex = getCurrentExerciseIndex();
  const routine = getRoutine();
  
  const totalSets = flatArray.length;
  const completedSets = currentIndex;
  const remainingSets = totalSets - currentIndex;
  
  const totalReps = flatArray.reduce((sum, item) => sum + item.reps, 0);
  const completedReps = flatArray.slice(0, currentIndex).reduce((sum, item) => sum + item.reps, 0);
  const remainingReps = totalReps - completedReps;
  
  return {
    totalSets,
    completedSets,
    remainingSets,
    totalReps,
    completedReps,
    remainingReps,
    progressPercentage: Math.round((completedSets / totalSets) * 100)
  };
}
