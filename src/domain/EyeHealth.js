/**
 * Domain layer for Eye Health functionality
 * Pure business logic for eye health exercises
 */

/**
 * Get the complete eye health routine data
 * @returns {Array} Array of eye health exercise objects
 */
export function getEyeHealthRoutine() {
  return [
    { 
      phase: 'focus', 
      name: 'Distance Focus', 
      duration: 15, 
      instruction: 'Look at something 20+ feet away and focus',
      audioCue: 'focus_start'
    },
    { 
      phase: 'movement', 
      name: 'Eye Exercises', 
      duration: 15, 
      instruction: 'Move eyes left, right, up, down in slow circles',
      audioCue: 'movement_start'
    },
    { 
      phase: 'breathing', 
      name: 'Box Breathing', 
      duration: 15, 
      instruction: 'Breathe in 4s, hold 4s, out 4s, hold 4s',
      audioCue: 'breathing_start'
    },
    { 
      phase: 'relaxation', 
      name: 'Eye Relaxation', 
      duration: 15, 
      instruction: 'Gentle blinking and eye relaxation',
      audioCue: 'relaxation_start'
    }
  ];
}

/**
 * Create a flat array of all eye health exercise phases
 * @param {Array} routine - Eye health routine array
 * @returns {Array} Flat array of exercise phases
 */
export function createFlatEyeHealthArray(routine) {
  const flat = [];
  routine.forEach((exercise, exerciseIndex) => {
    flat.push({ 
      exerciseIndex, 
      phase: exercise.phase,
      name: exercise.name,
      duration: exercise.duration,
      instruction: exercise.instruction,
      audioCue: exercise.audioCue
    });
  });
  return flat;
}

/**
 * Calculate eye health progress
 * @param {number} currentIndex - Current exercise index
 * @param {number} totalLength - Total number of exercise phases
 * @returns {Object} Progress information
 */
export function calculateEyeHealthProgress(currentIndex, totalLength) {
  const progress = Math.min(100, Math.max(0, (currentIndex / totalLength) * 100));
  return {
    current: currentIndex + 1,
    total: totalLength,
    percentage: Math.round(progress),
    isComplete: currentIndex >= totalLength - 1
  };
}

/**
 * Get eye health information for a specific index
 * @param {number} index - Exercise index
 * @param {Array} flatArray - Flat exercise array
 * @param {Array} routine - Original routine array
 * @returns {Object} Exercise information
 */
export function getEyeHealthInfo(index, flatArray, routine) {
  if (index < 0 || index >= flatArray.length) return null;
  
  const item = flatArray[index];
  
  return {
    title: item.name,
    subtitle: `${item.duration} seconds`,
    instruction: item.instruction,
    phase: item.phase,
    audioCue: item.audioCue,
    progress: `Phase ${index + 1} of ${flatArray.length}`
  };
}

/**
 * Calculate eye health timing
 * @param {number} duration - Duration in seconds
 * @returns {Object} Timing information
 */
export function calculateEyeHealthTiming(duration) {
  return {
    duration,
    totalTime: duration,
    remainingTime: duration
  };
}

/**
 * Get breathing pattern for box breathing
 * @returns {Object} Breathing pattern information
 */
export function getBreathingPattern() {
  return {
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    totalCycle: 16
  };
}

/**
 * Calculate breathing cycle progress
 * @param {number} secondsElapsed - Seconds elapsed in breathing phase
 * @returns {Object} Breathing cycle information
 */
export function calculateBreathingCycle(secondsElapsed) {
  const pattern = getBreathingPattern();
  const cyclePosition = secondsElapsed % pattern.totalCycle;
  
  let currentPhase = 'inhale';
  let phaseProgress = 0;
  let phaseRemaining = 0;
  
  if (cyclePosition < pattern.inhale) {
    currentPhase = 'inhale';
    phaseProgress = cyclePosition / pattern.inhale;
    phaseRemaining = pattern.inhale - cyclePosition;
  } else if (cyclePosition < pattern.inhale + pattern.hold1) {
    currentPhase = 'hold1';
    phaseProgress = (cyclePosition - pattern.inhale) / pattern.hold1;
    phaseRemaining = (pattern.inhale + pattern.hold1) - cyclePosition;
  } else if (cyclePosition < pattern.inhale + pattern.hold1 + pattern.exhale) {
    currentPhase = 'exhale';
    phaseProgress = (cyclePosition - pattern.inhale - pattern.hold1) / pattern.exhale;
    phaseRemaining = (pattern.inhale + pattern.hold1 + pattern.exhale) - cyclePosition;
  } else {
    currentPhase = 'hold2';
    phaseProgress = (cyclePosition - pattern.inhale - pattern.hold1 - pattern.exhale) / pattern.hold2;
    phaseRemaining = pattern.totalCycle - cyclePosition;
  }
  
  return {
    currentPhase,
    phaseProgress: Math.round(phaseProgress * 100),
    phaseRemaining: Math.ceil(phaseRemaining),
    cyclePosition,
    totalCycle: pattern.totalCycle
  };
}
