/**
 * Application layer for Mind/Brain Exercises operations
 * Business logic for mind exercise management
 */

import { 
  getMindExerciseDatabase, 
  getRandomExercise, 
  getExercisesByDifficulty, 
  getExercisesByType,
  calculateMindProgress,
  getMindStatistics,
  validateAnswer,
  validateAnswerWithPartialCredit,
  getExerciseHint
} from '../domain/Mind.js';
import { getItem, setItem } from '../infrastructure/Storage.js';

const MIND_SESSION_KEY = 'site-blocker:mind:session';
const MIND_STATISTICS_KEY = 'site-blocker:mind:statistics';

/**
 * Get the complete mind exercise database
 * @returns {Array} Mind exercise database
 */
export function getDatabase() {
  return getMindExerciseDatabase();
}

/**
 * Get random exercise
 * @param {string} type - Exercise type filter (optional)
 * @returns {Object} Random exercise
 */
export function getRandomMindExercise(type = null) {
  const database = getDatabase();
  return getRandomExercise(database, type);
}

/**
 * Get exercises by difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Filtered exercises
 */
export function getMindExercisesByDifficulty(difficulty) {
  const database = getDatabase();
  return getExercisesByDifficulty(database, difficulty);
}

/**
 * Get exercises by type
 * @param {string} type - Exercise type
 * @returns {Array} Filtered exercises
 */
export function getMindExercisesByType(type) {
  const database = getDatabase();
  return getExercisesByType(database, type);
}

/**
 * Start mind exercise session
 * @returns {Object} Session information
 */
export function startMindSession() {
  const session = {
    startTime: Date.now(),
    exercises: [],
    currentExercise: null,
    currentIndex: 0,
    isActive: true,
    score: 0,
    totalTime: 60 // 1 minute session
  };
  
  setItem(MIND_SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Get current mind session
 * @returns {Object|null} Current session or null
 */
export function getCurrentMindSession() {
  const sessionData = getItem(MIND_SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch (error) {
    console.warn('Failed to parse mind session:', error);
    return null;
  }
}

/**
 * Update mind session
 * @param {Object} session - Session object
 * @returns {boolean} Success status
 */
export function updateMindSession(session) {
  try {
    setItem(MIND_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.warn('Failed to update mind session:', error);
    return false;
  }
}

/**
 * End mind session
 * @returns {Object} Session end information
 */
export function endMindSession() {
  const session = getCurrentMindSession();
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
  saveMindStatistics(sessionResult);
  
  // Clear current session
  setItem(MIND_SESSION_KEY, '');
  
  return sessionResult;
}

/**
 * Add exercise to current session
 * @param {Object} exercise - Exercise object
 * @returns {boolean} Success status
 */
export function addExerciseToSession(exercise) {
  const session = getCurrentMindSession();
  if (!session) return false;
  
  session.exercises.push({
    ...exercise,
    timestamp: Date.now(),
    sessionIndex: session.exercises.length
  });
  
  session.currentIndex = session.exercises.length - 1;
  session.currentExercise = exercise;
  
  return updateMindSession(session);
}

/**
 * Submit answer for current exercise
 * @param {string} userAnswer - User's answer
 * @returns {Object} Answer result
 */
export function submitAnswer(userAnswer) {
  const session = getCurrentMindSession();
  if (!session || !session.currentExercise) {
    return { success: false, error: 'No active session or exercise' };
  }
  
  // Use partial credit validation
  const validationResult = validateAnswerWithPartialCredit(
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
  
  updateMindSession(session);
  
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
    hint: getExerciseHint(session.currentExercise)
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
export function getNextExercise(type = null) {
  const exercise = getRandomMindExercise(type);
  addExerciseToSession(exercise);
  return exercise;
}

/**
 * Get current exercise
 * @returns {Object|null} Current exercise
 */
export function getCurrentExercise() {
  const session = getCurrentMindSession();
  return session ? session.currentExercise : null;
}

/**
 * Get session progress
 * @returns {Object} Progress information
 */
export function getSessionProgress() {
  const session = getCurrentMindSession();
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
 * Save mind statistics
 * @param {Object} sessionResult - Session result
 * @returns {boolean} Success status
 */
function saveMindStatistics(sessionResult) {
  try {
    const existingStats = getItem(MIND_STATISTICS_KEY);
    let statistics = existingStats ? JSON.parse(existingStats) : {
      totalSessions: 0,
      totalScore: 0,
      totalExercises: 0,
      averageScore: 0,
      bestScore: 0,
      sessions: []
    };
    
    // Update statistics
    statistics.totalSessions += 1;
    statistics.totalScore += sessionResult.finalScore;
    statistics.totalExercises += sessionResult.exercisesCompleted;
    statistics.averageScore = Math.round(statistics.totalScore / statistics.totalSessions);
    statistics.bestScore = Math.max(statistics.bestScore, sessionResult.finalScore);
    
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
    
    setItem(MIND_STATISTICS_KEY, JSON.stringify(statistics));
    return true;
  } catch (error) {
    console.warn('Failed to save mind statistics:', error);
    return false;
  }
}

/**
 * Get mind statistics
 * @returns {Object} Statistics
 */
export function getMindStatisticsData() {
  try {
    const statsData = getItem(MIND_STATISTICS_KEY);
    if (!statsData) {
      return {
        totalSessions: 0,
        totalScore: 0,
        totalExercises: 0,
        averageScore: 0,
        bestScore: 0,
        sessions: []
      };
    }
    
    return JSON.parse(statsData);
  } catch (error) {
    console.warn('Failed to get mind statistics:', error);
    return {
      totalSessions: 0,
      totalScore: 0,
      totalExercises: 0,
      averageScore: 0,
      bestScore: 0,
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
export function isMindSessionActive() {
  const session = getCurrentMindSession();
  return session && session.isActive;
}

/**
 * Reset mind session
 * @returns {boolean} Success status
 */
export function resetMindSession() {
  setItem(MIND_SESSION_KEY, '');
  return true;
}
