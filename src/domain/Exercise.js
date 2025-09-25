/**
 * Domain layer for Exercise functionality
 * Pure business logic for exercise routines
 */

/**
 * Get the complete exercise routine data
 * @returns {Array} Array of exercise objects
 */
export function getExerciseRoutine() {
  return [
    { group: 'Neck', name: 'Neck bridges (floor)', sets: [10,10], notes: 'Slow roll head back/forward. Gentle.' },
    { group: 'Chest', name: 'TRX push-ups', sets: [4,6,6], notes: '@45–60°, straps ~30–40 cm (mid-shin). Full ROM.' },
    { group: 'Triceps', name: 'TRX extensions', sets: [10,10], notes: '@45°, straps ~60–70 cm (mid-thigh).' },
    { group: 'Legs', name: 'TRX pistol squats (assisted)', sets: [4,6,6], notes: 'Per leg @30–45°, straps ~60–80 cm. Control tempo.' },
    { group: 'Legs', name: 'TRX lunges', sets: [8,10], notes: 'Per leg @45°, straps ~30–40 cm.' },
    { group: 'Legs', name: 'TRX calf raises', sets: [15,15], notes: 'Per leg @45°, straps ~30–40 cm.' },
    { group: 'Shoulders', name: 'TRX presses', sets: [10,10], notes: '@45°, straps ~70–80 cm (chest).' },
    { group: 'Shoulders', name: 'TRX lateral raises', sets: [10,10], notes: '@30°, straps ~70–80 cm.' },
    { group: 'Back', name: 'TRX rows', sets: [4,6,6], notes: '@45–60°, straps ~100–110 cm (chest/waist).' },
    { group: 'Back', name: 'TRX face pulls', sets: [6,8,8], notes: '@30°, straps ~80–90 cm (shoulders).' },
    { group: 'Arms', name: 'TRX curls', sets: [10,10], notes: '@45°, straps ~60–70 cm. Supinated wide grip.' },
    { group: 'Arms', name: 'TRX reverse curls', sets: [10,10], notes: '@45°, straps ~60–70 cm. Pronated grip.' },
    { group: 'Arms', name: 'Finger extensions (floor)', sets: [12,12], notes: 'Open/close hands; slow control.' }
  ];
}

/**
 * Create a flat array of all exercise sets
 * @param {Array} routine - Exercise routine array
 * @returns {Array} Flat array of exercise sets
 */
export function createFlatExerciseArray(routine) {
  const flat = [];
  routine.forEach((exercise, exerciseIndex) => {
    exercise.sets.forEach((reps, setIndex) => {
      flat.push({ 
        exerciseIndex, 
        setIndex, 
        reps,
        exercise: routine[exerciseIndex]
      });
    });
  });
  return flat;
}

/**
 * Calculate exercise progress
 * @param {number} currentIndex - Current exercise index
 * @param {number} totalLength - Total number of exercise sets
 * @returns {Object} Progress information
 */
export function calculateExerciseProgress(currentIndex, totalLength) {
  const progress = Math.min(100, Math.max(0, (currentIndex / totalLength) * 100));
  return {
    current: currentIndex + 1,
    total: totalLength,
    percentage: Math.round(progress),
    isComplete: currentIndex >= totalLength - 1
  };
}

/**
 * Get exercise information for a specific index
 * @param {number} index - Exercise index
 * @param {Array} flatArray - Flat exercise array
 * @param {Array} routine - Original routine array
 * @returns {Object} Exercise information
 */
export function getExerciseInfo(index, flatArray, routine) {
  if (index < 0 || index >= flatArray.length) return null;
  
  const item = flatArray[index];
  const exercise = routine[item.exerciseIndex];
  
  return {
    title: `${exercise.group}: ${exercise.name}`,
    subtitle: `Set ${item.setIndex + 1} of ${exercise.sets.length} — ${item.reps} reps`,
    notes: exercise.notes + ' Tempo 4s/rep, 75s rest between sets, 2m between exercises.',
    progress: `Progress: ${index + 1} / ${flatArray.length}. After finishing all sets, the cycle restarts.`
  };
}

/**
 * Calculate exercise timing
 * @param {number} reps - Number of repetitions
 * @param {number} tempoSeconds - Seconds per rep
 * @param {number} restSeconds - Rest time between sets
 * @returns {Object} Timing information
 */
export function calculateExerciseTiming(reps, tempoSeconds = 4, restSeconds = 75) {
  const workTime = reps * tempoSeconds;
  const totalTime = workTime + restSeconds;
  
  return {
    reps,
    tempoSeconds,
    restSeconds,
    workTime,
    totalTime
  };
}
