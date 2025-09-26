/**
 * Application layer for Chinese Language Learning operations
 * Business logic for Chinese vocabulary and learning sessions
 */

import { 
  getRandomVocabulary, 
  getVocabularyById, 
  getVocabularyStatistics,
  getVocabularyProgress,
  updateVocabularyProgress,
  getOverallLearningStatistics,
  searchVocabulary,
  getDifficultyLevels
} from '../domain/Chinese.js';
import { getChineseProgress, setChineseProgress } from '../infrastructure/Storage.js';

// Current learning session state
let currentSession = {
  vocabulary: null,
  startTime: null,
  isRecording: false,
  recordingStartTime: null,
  recordings: []
};

/**
 * Start a new Chinese learning session
 * @param {string} difficulty - Difficulty level (optional)
 * @returns {Object} Session information
 */
export function startChineseSession(difficulty = null) {
  const vocabulary = getRandomVocabulary(difficulty);
  const startTime = new Date();
  
  currentSession = {
    vocabulary,
    startTime,
    isRecording: false,
    recordingStartTime: null,
    recordings: []
  };
  
  return {
    vocabulary,
    startTime,
    sessionId: `session_${Date.now()}`
  };
}

/**
 * Get current session vocabulary
 * @returns {Object|null} Current vocabulary or null
 */
export function getCurrentSessionVocabulary() {
  return currentSession.vocabulary;
}

/**
 * Get current session information
 * @returns {Object} Session information
 */
export function getCurrentSession() {
  return {
    ...currentSession,
    duration: currentSession.startTime ? 
      Math.floor((new Date() - currentSession.startTime) / 1000) : 0
  };
}

/**
 * Start voice recording
 * @returns {boolean} Success status
 */
export function startVoiceRecording() {
  if (currentSession.isRecording) {
    return false;
  }
  
  currentSession.isRecording = true;
  currentSession.recordingStartTime = new Date();
  
  return true;
}

/**
 * Stop voice recording
 * @returns {Object|null} Recording data or null
 */
export function stopVoiceRecording() {
  if (!currentSession.isRecording) {
    return null;
  }
  
  const recording = {
    id: `recording_${Date.now()}`,
    startTime: currentSession.recordingStartTime,
    endTime: new Date(),
    duration: Math.floor((new Date() - currentSession.recordingStartTime) / 1000)
  };
  
  currentSession.recordings.push(recording);
  currentSession.isRecording = false;
  currentSession.recordingStartTime = null;
  
  return recording;
}

/**
 * Get session recordings
 * @returns {Array} Array of recordings
 */
export function getSessionRecordings() {
  return [...currentSession.recordings];
}

/**
 * Clear current session
 */
export function clearCurrentSession() {
  currentSession = {
    vocabulary: null,
    startTime: null,
    isRecording: false,
    recordingStartTime: null,
    recordings: []
  };
}

/**
 * Get vocabulary progress for current user
 * @param {number} vocabularyId - Vocabulary ID
 * @returns {Object} Progress information
 */
export function getVocabularyProgressForUser(vocabularyId) {
  const progressData = getChineseProgress();
  return getVocabularyProgress(vocabularyId, progressData);
}

/**
 * Update vocabulary progress for current user
 * @param {number} vocabularyId - Vocabulary ID
 * @param {boolean} isCorrect - Whether the answer was correct
 * @returns {boolean} Success status
 */
export function updateVocabularyProgressForUser(vocabularyId, isCorrect) {
  try {
    const progressData = getChineseProgress();
    const updatedProgress = updateVocabularyProgress(vocabularyId, isCorrect, progressData);
    return setChineseProgress(updatedProgress);
  } catch (error) {
    console.warn('Failed to update vocabulary progress:', error);
    return false;
  }
}

/**
 * Get overall learning statistics for current user
 * @returns {Object} Learning statistics
 */
export function getOverallLearningStatsForUser() {
  const progressData = getChineseProgress();
  return getOverallLearningStatistics(progressData);
}

/**
 * Get vocabulary statistics
 * @returns {Object} Vocabulary statistics
 */
export function getVocabularyStats() {
  return getVocabularyStatistics();
}

/**
 * Search vocabulary
 * @param {string} query - Search query
 * @returns {Array} Matching vocabulary entries
 */
export function searchVocabularyEntries(query) {
  return searchVocabulary(query);
}

/**
 * Get difficulty levels
 * @returns {Array} Available difficulty levels
 */
export function getAvailableDifficultyLevels() {
  return getDifficultyLevels();
}

/**
 * Get vocabulary by ID
 * @param {number} id - Vocabulary ID
 * @returns {Object|null} Vocabulary entry or null
 */
export function getVocabularyEntryById(id) {
  return getVocabularyById(id);
}

/**
 * Get random vocabulary for practice
 * @param {string} difficulty - Difficulty level (optional)
 * @returns {Object} Random vocabulary entry
 */
export function getRandomVocabularyForPractice(difficulty = null) {
  return getRandomVocabulary(difficulty);
}

/**
 * Check if session is active
 * @returns {boolean} True if session is active
 */
export function isSessionActive() {
  return currentSession.vocabulary !== null;
}

/**
 * Check if currently recording
 * @returns {boolean} True if recording
 */
export function isCurrentlyRecording() {
  return currentSession.isRecording;
}

/**
 * Get session duration in seconds
 * @returns {number} Session duration
 */
export function getSessionDuration() {
  if (!currentSession.startTime) {
    return 0;
  }
  
  return Math.floor((new Date() - currentSession.startTime) / 1000);
}

/**
 * Get remaining session time
 * @param {number} maxDuration - Maximum session duration in seconds (default: 60)
 * @returns {number} Remaining time in seconds
 */
export function getRemainingSessionTime(maxDuration = 60) {
  const duration = getSessionDuration();
  return Math.max(0, maxDuration - duration);
}

/**
 * Check if session should auto-close
 * @param {number} maxDuration - Maximum session duration in seconds (default: 60)
 * @returns {boolean} True if session should close
 */
export function shouldAutoCloseSession(maxDuration = 60) {
  return getSessionDuration() >= maxDuration;
}

/**
 * Get learning recommendations based on progress
 * @returns {Object} Learning recommendations
 */
export function getLearningRecommendations() {
  const stats = getOverallLearningStatsForUser();
  const recommendations = [];
  
  if (stats.totalWords === 0) {
    recommendations.push('Start with beginner vocabulary');
  } else if (stats.averageMastery < 50) {
    recommendations.push('Focus on reviewing difficult words');
  } else if (stats.averageMastery < 80) {
    recommendations.push('Practice intermediate vocabulary');
  } else {
    recommendations.push('Try advanced vocabulary for new challenges');
  }
  
  if (stats.totalAttempts < 10) {
    recommendations.push('Practice more frequently for better retention');
  }
  
  return {
    recommendations,
    stats
  };
}

/**
 * Get next vocabulary suggestion based on progress
 * @returns {Object|null} Suggested vocabulary or null
 */
export function getNextVocabularySuggestion() {
  const progressData = getChineseProgress();
  const allVocabulary = Object.keys(progressData);
  
  if (allVocabulary.length === 0) {
    // No progress yet, suggest beginner vocabulary
    return getRandomVocabulary('beginner');
  }
  
  // Find vocabulary with lowest mastery
  let lowestMastery = 100;
  let suggestedId = null;
  
  for (const [vocabId, progress] of Object.entries(progressData)) {
    const mastery = progress.attempts > 0 ? (progress.correct / progress.attempts) * 100 : 0;
    if (mastery < lowestMastery) {
      lowestMastery = mastery;
      suggestedId = parseInt(vocabId);
    }
  }
  
  if (suggestedId) {
    return getVocabularyById(suggestedId);
  }
  
  // Fallback to random vocabulary
  return getRandomVocabulary();
}

/**
 * Reset all learning progress
 * @returns {boolean} Success status
 */
export function resetAllProgress() {
  try {
    setChineseProgress({});
    return true;
  } catch (error) {
    console.warn('Failed to reset progress:', error);
    return false;
  }
}
