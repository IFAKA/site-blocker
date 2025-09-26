/**
 * Application layer for Brain Training operations
 * Business logic for brain training management
 */

import { 
  getBrainTrainingExerciseDatabase, 
  getRandomBrainTrainingExercise, 
  getBrainTrainingExercisesByDifficulty, 
  getBrainTrainingExercisesByType,
  calculateBrainTrainingProgress,
  getBrainTrainingStatistics,
  validateBrainTrainingAnswer,
  validateBrainTrainingAnswerWithPartialCredit,
  getBrainTrainingExerciseHint
} from '../domain/BrainTraining.js';
import { getItem, setItem } from '../infrastructure/Storage.js';

const BRAIN_TRAINING_SESSION_KEY = 'site-blocker:brain-training:session';
const BRAIN_TRAINING_STATISTICS_KEY = 'site-blocker:brain-training:statistics';

/**
 * Get the complete brain training exercise database
 * @returns {Array} Brain training exercise database
 */
export function getDatabase() {
  return getBrainTrainingExerciseDatabase();
}

/**
 * Get random brain training exercise
 * @param {string} type - Exercise type filter (optional)
 * @returns {Object} Random exercise
 */
export function getRandomExercise(type = null) {
  const database = getDatabase();
  return getRandomBrainTrainingExercise(database, type);
}

/**
 * Get brain training exercises by difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Filtered exercises
 */
export function getExercisesByDifficulty(difficulty) {
  const database = getDatabase();
  return getBrainTrainingExercisesByDifficulty(database, difficulty);
}

/**
 * Get brain training exercises by type
 * @param {string} type - Exercise type
 * @returns {Array} Filtered exercises
 */
export function getExercisesByType(type) {
  const database = getDatabase();
  return getBrainTrainingExercisesByType(database, type);
}

/**
 * Start brain training session
 * @returns {Object} Session information
 */
export function startBrainTrainingSession() {
  const session = {
    startTime: Date.now(),
    exercises: [],
    currentExercise: null,
    currentIndex: 0,
    isActive: true,
    score: 0,
    totalTime: 60, // 1 minute session
    difficulty: 'medium', // Default difficulty
    exerciseTypes: ['mental_math', 'pattern_recognition', 'memory_matrices', 'quick_logic', 'financial_calculations']
  };
  
  setItem(BRAIN_TRAINING_SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Get current brain training session
 * @returns {Object|null} Current session or null
 */
export function getCurrentBrainTrainingSession() {
  const sessionData = getItem(BRAIN_TRAINING_SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch (error) {
    console.warn('Failed to parse brain training session:', error);
    return null;
  }
}

/**
 * Update brain training session
 * @param {Object} session - Session object
 * @returns {boolean} Success status
 */
export function updateBrainTrainingSession(session) {
  try {
    setItem(BRAIN_TRAINING_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.warn('Failed to update brain training session:', error);
    return false;
  }
}

/**
 * End brain training session
 * @returns {Object} Session end information
 */
export function endBrainTrainingSession() {
  const session = getCurrentBrainTrainingSession();
  if (!session) return null;
  
  const endTime = Date.now();
  const duration = endTime - session.startTime;
  
  const sessionResult = {
    ...session,
    endTime,
    duration,
    isActive: false,
    finalScore: session.score,
    exercisesCompleted: session.exercises.length
  };
  
  // Save to statistics
  saveBrainTrainingStatistics(sessionResult);
  
  // Clear current session
  setItem(BRAIN_TRAINING_SESSION_KEY, '');
  
  return sessionResult;
}

/**
 * Add exercise to current session
 * @param {Object} exercise - Exercise object
 * @returns {boolean} Success status
 */
export function addExerciseToSession(exercise) {
  const session = getCurrentBrainTrainingSession();
  if (!session) return false;
  
  session.exercises.push({
    ...exercise,
    timestamp: Date.now(),
    sessionIndex: session.exercises.length
  });
  
  session.currentIndex = session.exercises.length - 1;
  session.currentExercise = exercise;
  
  return updateBrainTrainingSession(session);
}

/**
 * Submit answer for current exercise
 * @param {string} userAnswer - User's answer
 * @returns {Object} Answer result
 */
export function submitBrainTrainingAnswer(userAnswer) {
  const session = getCurrentBrainTrainingSession();
  if (!session || !session.currentExercise) {
    return { success: false, error: 'No active session or exercise' };
  }
  
  // Use partial credit validation
  const validationResult = validateBrainTrainingAnswerWithPartialCredit(
    userAnswer, 
    session.currentExercise.answer, 
    session.currentExercise.type
  );
  
  // Calculate points based on partial credit
  const basePoints = getExercisePoints(session.currentExercise);
  const points = Math.round(basePoints * validationResult.partialCredit);
  
  // Update session
  session.score += points;
  session.exercises[session.exercises.length - 1].userAnswer = userAnswer;
  session.exercises[session.exercises.length - 1].isCorrect = validationResult.isCorrect;
  session.exercises[session.exercises.length - 1].points = points;
  session.exercises[session.exercises.length - 1].partialCredit = validationResult.partialCredit;
  
  updateBrainTrainingSession(session);
  
  return {
    success: true,
    isCorrect: validationResult.isCorrect,
    isExact: validationResult.isExact,
    points,
    partialCredit: validationResult.partialCredit,
    correctParts: validationResult.correctParts,
    incorrectParts: validationResult.incorrectParts,
    feedback: validationResult.feedback,
    correctAnswer: session.currentExercise.answer,
    explanation: session.currentExercise.explanation,
    hint: getBrainTrainingExerciseHint(session.currentExercise)
  };
}

/**
 * Get points for exercise based on difficulty
 * @param {Object} exercise - Exercise object
 * @returns {number} Points
 */
function getExercisePoints(exercise) {
  switch (exercise.difficulty) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
    default: return 1;
  }
}

/**
 * Get next exercise for session
 * @param {string} type - Exercise type filter (optional)
 * @returns {Object} Next exercise
 */
export function getNextBrainTrainingExercise(type = null) {
  const exercise = getRandomExercise(type);
  addExerciseToSession(exercise);
  return exercise;
}

/**
 * Get current exercise
 * @returns {Object|null} Current exercise
 */
export function getCurrentBrainTrainingExercise() {
  const session = getCurrentBrainTrainingSession();
  return session ? session.currentExercise : null;
}

/**
 * Get session progress
 * @returns {Object} Progress information
 */
export function getBrainTrainingSessionProgress() {
  const session = getCurrentBrainTrainingSession();
  if (!session) return null;
  
  const elapsed = Date.now() - session.startTime;
  const remaining = Math.max(0, session.totalTime * 1000 - elapsed);
  const progress = Math.min(100, (elapsed / (session.totalTime * 1000)) * 100);
  
  return {
    elapsed: Math.floor(elapsed / 1000),
    remaining: Math.floor(remaining / 1000),
    progress: Math.round(progress),
    score: session.score,
    exercisesCompleted: session.exercises.length,
    isComplete: remaining <= 0
  };
}

/**
 * Save brain training statistics
 * @param {Object} sessionResult - Session result
 * @returns {boolean} Success status
 */
function saveBrainTrainingStatistics(sessionResult) {
  try {
    const existingStats = getItem(BRAIN_TRAINING_STATISTICS_KEY);
    let statistics = existingStats ? JSON.parse(existingStats) : {
      totalSessions: 0,
      totalScore: 0,
      totalExercises: 0,
      averageScore: 0,
      bestScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      sessions: []
    };
    
    // Update statistics
    statistics.totalSessions += 1;
    statistics.totalScore += sessionResult.finalScore;
    statistics.totalExercises += sessionResult.exercisesCompleted;
    statistics.averageScore = Math.round(statistics.totalScore / statistics.totalSessions);
    statistics.bestScore = Math.max(statistics.bestScore, sessionResult.finalScore);
    
    // Update streak
    const today = new Date().toDateString();
    const lastSessionDate = statistics.sessions.length > 0 ? 
      new Date(statistics.sessions[statistics.sessions.length - 1].date).toDateString() : null;
    
    if (lastSessionDate === today) {
      // Same day, don't change streak
    } else if (lastSessionDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Consecutive day, increment streak
      statistics.currentStreak += 1;
    } else {
      // Streak broken, reset
      statistics.currentStreak = 1;
    }
    
    statistics.longestStreak = Math.max(statistics.longestStreak, statistics.currentStreak);
    
    // Add session to history (keep last 50 sessions)
    statistics.sessions.push({
      date: new Date().toISOString(),
      score: sessionResult.finalScore,
      exercises: sessionResult.exercisesCompleted,
      duration: sessionResult.duration
    });
    
    if (statistics.sessions.length > 50) {
      statistics.sessions = statistics.sessions.slice(-50);
    }
    
    setItem(BRAIN_TRAINING_STATISTICS_KEY, JSON.stringify(statistics));
    return true;
  } catch (error) {
    console.warn('Failed to save brain training statistics:', error);
    return false;
  }
}

/**
 * Get brain training statistics
 * @returns {Object} Statistics
 */
export function getBrainTrainingStatisticsData() {
  try {
    const statsData = getItem(BRAIN_TRAINING_STATISTICS_KEY);
    if (!statsData) {
      return {
        totalSessions: 0,
        totalScore: 0,
        totalExercises: 0,
        averageScore: 0,
        bestScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        sessions: []
      };
    }
    
    return JSON.parse(statsData);
  } catch (error) {
    console.warn('Failed to get brain training statistics:', error);
    return {
      totalSessions: 0,
      totalScore: 0,
      totalExercises: 0,
      averageScore: 0,
      bestScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      sessions: []
    };
  }
}

/**
 * Get exercise categories
 * @returns {Array} Array of exercise categories
 */
export function getExerciseCategories() {
  const database = getDatabase();
  const categories = [...new Set(database.map(exercise => exercise.category))];
  return categories;
}

/**
 * Get exercise types
 * @returns {Array} Array of exercise types
 */
export function getExerciseTypes() {
  const database = getDatabase();
  const types = [...new Set(database.map(exercise => exercise.type))];
  return types;
}

/**
 * Get difficulty levels
 * @returns {Array} Array of difficulty levels
 */
export function getDifficultyLevels() {
  return ['easy', 'medium', 'hard'];
}

/**
 * Check if session is active
 * @returns {boolean} True if session is active
 */
export function isBrainTrainingSessionActive() {
  const session = getCurrentBrainTrainingSession();
  return session && session.isActive;
}

/**
 * Reset brain training session
 * @returns {boolean} Success status
 */
export function resetBrainTrainingSession() {
  setItem(BRAIN_TRAINING_SESSION_KEY, '');
  return true;
}

/**
 * Set session difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {boolean} Success status
 */
export function setSessionDifficulty(difficulty) {
  const session = getCurrentBrainTrainingSession();
  if (!session) return false;
  
  session.difficulty = difficulty;
  return updateBrainTrainingSession(session);
}

/**
 * Set session exercise types
 * @param {Array} types - Array of exercise types
 * @returns {boolean} Success status
 */
export function setSessionExerciseTypes(types) {
  const session = getCurrentBrainTrainingSession();
  if (!session) return false;
  
  session.exerciseTypes = types;
  return updateBrainTrainingSession(session);
}

/**
 * Get session configuration
 * @returns {Object} Session configuration
 */
export function getSessionConfiguration() {
  const session = getCurrentBrainTrainingSession();
  if (!session) {
    return {
      difficulty: 'medium',
      exerciseTypes: ['mental_math', 'pattern_recognition', 'memory_matrices', 'quick_logic', 'financial_calculations'],
      totalTime: 60
    };
  }
  
  return {
    difficulty: session.difficulty,
    exerciseTypes: session.exerciseTypes,
    totalTime: session.totalTime
  };
}

/**
 * Update session configuration
 * @param {Object} config - Configuration object
 * @returns {boolean} Success status
 */
export function updateSessionConfiguration(config) {
  const session = getCurrentBrainTrainingSession();
  if (!session) return false;
  
  if (config.difficulty) session.difficulty = config.difficulty;
  if (config.exerciseTypes) session.exerciseTypes = config.exerciseTypes;
  if (config.totalTime) session.totalTime = config.totalTime;
  
  return updateBrainTrainingSession(session);
}
