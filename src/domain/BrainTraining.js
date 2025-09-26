/**
 * Domain layer for Brain Training functionality
 * Pure business logic for brain exercises and cognitive training
 */

/**
 * Get the complete brain training exercise database
 * @returns {Array} Array of brain training exercise objects
 */
export function getBrainTrainingExerciseDatabase() {
  return [
    // Mental Math exercises
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 15% of 240',
      answer: '36',
      explanation: '15% of 240 = 0.15 × 240 = 36',
      difficulty: 'medium'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 7 × 13?',
      answer: '91',
      explanation: '7 × 13 = 7 × 10 + 7 × 3 = 70 + 21 = 91',
      difficulty: 'easy'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 25% of 180',
      answer: '45',
      explanation: '25% of 180 = 0.25 × 180 = 45',
      difficulty: 'easy'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 12 × 15?',
      answer: '180',
      explanation: '12 × 15 = 12 × 10 + 12 × 5 = 120 + 60 = 180',
      difficulty: 'medium'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 33% of 150',
      answer: '49.5',
      explanation: '33% of 150 = 0.33 × 150 = 49.5',
      difficulty: 'hard'
    },

    // Pattern Recognition exercises
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 1, 2, 3, 5, 8, ?',
      answer: '13',
      explanation: 'Fibonacci sequence: each number is the sum of the two preceding numbers',
      difficulty: 'medium'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 2, 4, 8, 16, 32, ?',
      answer: '64',
      explanation: 'Powers of 2: 2¹, 2², 2³, 2⁴, 2⁵, 2⁶',
      difficulty: 'easy'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 4, 9, 16, 25, ?',
      answer: '36',
      explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6²',
      difficulty: 'medium'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 3, 6, 12, 24, 48, ?',
      answer: '96',
      explanation: 'Each number is double the previous: 3×2=6, 6×2=12, etc.',
      difficulty: 'easy'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 8, 27, 64, 125, ?',
      answer: '216',
      explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³',
      difficulty: 'hard'
    },

    // Quick Logic exercises
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all traders are analysts and John is a trader, what can we conclude?',
      answer: 'John is an analyst',
      explanation: 'If all A are B, and X is A, then X is B',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If no cats are dogs and Fluffy is a cat, what can we conclude?',
      answer: 'Fluffy is not a dog',
      explanation: 'If no A are B, and X is A, then X is not B',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If some birds can fly and Tweety is a bird, what can we conclude?',
      answer: 'Tweety might be able to fly',
      explanation: 'Some A are B, and X is A, so X might be B (not certain)',
      difficulty: 'medium'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all roses are flowers and some flowers are red, what can we conclude?',
      answer: 'Some roses might be red',
      explanation: 'All A are B, some B are C, so some A might be C',
      difficulty: 'hard'
    },

    // Memory Matrices exercises
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '3 8 1 6 4 9 2 7 5',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[3, 8, 1], [6, 4, 9], [2, 7, 5]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '9 1 4 2 6 8 5 3 7',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[9, 1, 4], [2, 6, 8], [5, 3, 7]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '1 5 9 3 7 2 8 4 6',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[1, 5, 9], [3, 7, 2], [8, 4, 6]]
    },

    // Financial Calculations exercises
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Stock goes up 15% then down 10%, net change?',
      answer: '+3.5%',
      explanation: '1.15 × 0.90 = 1.035, so +3.5% net change',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'If $1000 grows at 8% annually for 3 years, final amount?',
      answer: '$1,259.71',
      explanation: '$1000 × 1.08³ = $1000 × 1.259712 = $1,259.71',
      difficulty: 'hard'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Stock price $50, drops 20%, then rises 25%, final price?',
      answer: '$50',
      explanation: '$50 × 0.80 × 1.25 = $50 × 1.00 = $50',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Portfolio: 60% stocks (+12%), 40% bonds (+4%), total return?',
      answer: '+8.8%',
      explanation: '0.6 × 12% + 0.4 × 4% = 7.2% + 1.6% = 8.8%',
      difficulty: 'hard'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Bond yield 5%, inflation 3%, real return?',
      answer: '+2%',
      explanation: 'Real return = Nominal return - Inflation = 5% - 3% = 2%',
      difficulty: 'easy'
    },

    // Word Problems exercises
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'A trader buys 100 shares at $50, sells 50 at $60, keeps 50. Net position value?',
      answer: '$5500',
      explanation: 'Sold 50×$60=$3000, kept 50×$60=$3000, total=$6000. Cost was 100×$50=$5000. Net=$1000 profit + $5000 cost = $6000',
      difficulty: 'medium'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Portfolio: $10k stocks (+15%), $5k bonds (+3%), $5k cash (0%). Total return?',
      answer: '+8.25%',
      explanation: 'Total value: $10k×1.15 + $5k×1.03 + $5k×1.00 = $11.5k + $5.15k + $5k = $21.65k. Return = ($21.65k-$20k)/$20k = 8.25%',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Stock: $100 → $120 → $90 → $110. Total return?',
      answer: '+10%',
      explanation: 'Final value $110, initial $100, return = ($110-$100)/$100 = 10%',
      difficulty: 'easy'
    },

    // Spatial Reasoning exercises
    {
      type: 'spatial_reasoning',
      category: 'Spatial Reasoning',
      question: 'If you fold a square piece of paper in half twice and cut a small triangle from the corner, how many holes will you have when unfolded?',
      answer: '4',
      explanation: 'Each fold doubles the number of holes, so 1 cut becomes 4 holes after 2 folds',
      difficulty: 'medium'
    },
    {
      type: 'spatial_reasoning',
      category: 'Spatial Reasoning',
      question: 'A cube is painted on all sides and cut into 27 smaller cubes. How many small cubes have exactly 2 painted faces?',
      answer: '12',
      explanation: 'Only the edge cubes (not corners or center) have exactly 2 painted faces. A 3×3×3 cube has 12 edges.',
      difficulty: 'hard'
    },
    {
      type: 'spatial_reasoning',
      category: 'Spatial Reasoning',
      question: 'If you rotate a square 90 degrees clockwise, then 180 degrees, what is the final orientation?',
      answer: '270 degrees clockwise from original',
      explanation: '90° + 180° = 270° clockwise rotation from the original position',
      difficulty: 'easy'
    },

    // Verbal Reasoning exercises
    {
      type: 'verbal_reasoning',
      category: 'Verbal Reasoning',
      question: 'If all roses are flowers and some flowers are red, what can we conclude about roses?',
      answer: 'Some roses might be red',
      explanation: 'All A are B, some B are C, so some A might be C (not all, not none)',
      difficulty: 'medium'
    },
    {
      type: 'verbal_reasoning',
      category: 'Verbal Reasoning',
      question: 'If no fish can fly and Nemo is a fish, what can we conclude about Nemo?',
      answer: 'Nemo cannot fly',
      explanation: 'If no A can B, and X is A, then X cannot B',
      difficulty: 'easy'
    },
    {
      type: 'verbal_reasoning',
      category: 'Verbal Reasoning',
      question: 'If some students are athletes and Maria is a student, what can we conclude about Maria?',
      answer: 'Maria might be an athlete',
      explanation: 'We cannot definitively conclude Maria is an athlete since only "some" students are athletes',
      difficulty: 'medium'
    },

    // Number Sequences exercises
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 3.14, 2.71, 1.41',
      answer: 'π, e, √2',
      explanation: 'Mathematical constants: π ≈ 3.14, e ≈ 2.71, √2 ≈ 1.41',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 2, 3, 5, 7, 11, 13',
      answer: 'Prime numbers',
      explanation: 'First 7 prime numbers in sequence',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 4, 9, 16, 25, 36, 49',
      answer: 'Perfect squares',
      explanation: 'Squares of 1, 2, 3, 4, 5, 6, 7',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 1, 2, 6, 24, 120, 720',
      answer: 'Factorials',
      explanation: '1!, 2!, 3!, 4!, 5!, 6!, 7!',
      difficulty: 'hard'
    }
  ];
}

/**
 * Generate dynamic mental math exercise
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {Object} Generated exercise
 */
export function generateMentalMathExercise(difficulty = 'easy') {
  const exercises = {
    easy: [
      () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        return {
          type: 'mental_math',
          category: 'Mental Math',
          question: `What is ${a} × ${b}?`,
          answer: (a * b).toString(),
          explanation: `${a} × ${b} = ${a * b}`,
          difficulty: 'easy'
        };
      },
      () => {
        const percent = Math.floor(Math.random() * 20) + 5; // 5-25%
        const number = Math.floor(Math.random() * 200) + 50; // 50-250
        const result = (number * percent / 100).toFixed(1);
        return {
          type: 'mental_math',
          category: 'Mental Math',
          question: `Calculate ${percent}% of ${number}`,
          answer: result,
          explanation: `${percent}% of ${number} = ${percent/100} × ${number} = ${result}`,
          difficulty: 'easy'
        };
      }
    ],
    medium: [
      () => {
        const a = Math.floor(Math.random() * 20) + 10; // 10-30
        const b = Math.floor(Math.random() * 20) + 10; // 10-30
        return {
          type: 'mental_math',
          category: 'Mental Math',
          question: `What is ${a} × ${b}?`,
          answer: (a * b).toString(),
          explanation: `${a} × ${b} = ${a * b}`,
          difficulty: 'medium'
        };
      },
      () => {
        const percent = Math.floor(Math.random() * 30) + 10; // 10-40%
        const number = Math.floor(Math.random() * 300) + 100; // 100-400
        const result = (number * percent / 100).toFixed(1);
        return {
          type: 'mental_math',
          category: 'Mental Math',
          question: `Calculate ${percent}% of ${number}`,
          answer: result,
          explanation: `${percent}% of ${number} = ${percent/100} × ${number} = ${result}`,
          difficulty: 'medium'
        };
      }
    ],
    hard: [
      () => {
        const a = Math.floor(Math.random() * 30) + 20; // 20-50
        const b = Math.floor(Math.random() * 30) + 20; // 20-50
        return {
          type: 'mental_math',
          category: 'Mental Math',
          question: `What is ${a} × ${b}?`,
          answer: (a * b).toString(),
          explanation: `${a} × ${b} = ${a * b}`,
          difficulty: 'hard'
        };
      },
      () => {
        const percent = Math.floor(Math.random() * 40) + 20; // 20-60%
        const number = Math.floor(Math.random() * 500) + 200; // 200-700
        const result = (number * percent / 100).toFixed(1);
        return {
          type: 'mental_math',
          category: 'Mental Math',
          question: `Calculate ${percent}% of ${number}`,
          answer: result,
          explanation: `${percent}% of ${number} = ${percent/100} × ${number} = ${result}`,
          difficulty: 'hard'
        };
      }
    ]
  };

  const difficultyExercises = exercises[difficulty] || exercises.easy;
  const randomExercise = difficultyExercises[Math.floor(Math.random() * difficultyExercises.length)];
  return randomExercise();
}

/**
 * Generate dynamic pattern recognition exercise
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {Object} Generated exercise
 */
export function generatePatternRecognitionExercise(difficulty = 'easy') {
  const patterns = {
    easy: [
      () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const step = Math.floor(Math.random() * 3) + 1;
        const sequence = [start, start + step, start + 2*step, start + 3*step, start + 4*step];
        const next = start + 5*step;
        return {
          type: 'pattern_recognition',
          category: 'Pattern Recognition',
          question: `Next: ${sequence.join(', ')}?`,
          answer: next.toString(),
          explanation: `Arithmetic sequence: add ${step} each time`,
          difficulty: 'easy'
        };
      }
    ],
    medium: [
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        const sequence = [start, start + step, start + 2*step, start + 3*step, start + 4*step];
        const next = start + 5*step;
        return {
          type: 'pattern_recognition',
          category: 'Pattern Recognition',
          question: `Next: ${sequence.join(', ')}?`,
          answer: next.toString(),
          explanation: `Arithmetic sequence: add ${step} each time`,
          difficulty: 'medium'
        };
      }
    ],
    hard: [
      () => {
        const a = Math.floor(Math.random() * 5) + 2;
        const sequence = [a, a*a, a*a*a, a*a*a*a];
        const next = a*a*a*a*a;
        return {
          type: 'pattern_recognition',
          category: 'Pattern Recognition',
          question: `Next: ${sequence.join(', ')}?`,
          answer: next.toString(),
          explanation: `Powers of ${a}: ${a}¹, ${a}², ${a}³, ${a}⁴, ${a}⁵`,
          difficulty: 'hard'
        };
      }
    ]
  };

  const difficultyPatterns = patterns[difficulty] || patterns.easy;
  const randomPattern = difficultyPatterns[Math.floor(Math.random() * difficultyPatterns.length)];
  return randomPattern();
}

/**
 * Generate dynamic memory matrix
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {Object} Generated exercise
 */
export function generateMemoryMatrixExercise(difficulty = 'medium') {
  const generateMatrix = (size) => {
    const matrix = [];
    const numbers = [];
    
    // Generate unique numbers for the matrix
    for (let i = 0; i < size * size; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 9) + 1; // 1-9
      } while (numbers.includes(num));
      numbers.push(num);
    }
    
    // Create matrix
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = numbers[i * size + j];
      }
    }
    
    return matrix;
  };

  const matrix = generateMatrix(3);
  const answer = matrix.flat().join(' ');
  
  return {
    type: 'memory_matrices',
    category: 'Memory Matrices',
    question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
    answer: answer,
    explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
    difficulty: difficulty,
    matrix: matrix
  };
}

/**
 * Get random exercise from database or generate dynamic one
 * @param {Array} database - Exercise database
 * @param {string} type - Exercise type filter (optional)
 * @returns {Object} Random exercise
 */
export function getRandomBrainTrainingExercise(database, type = null) {
  // Check if we should generate a dynamic exercise
  const dynamicTypes = ['mental_math', 'pattern_recognition', 'memory_matrices'];
  
  if (type && dynamicTypes.includes(type)) {
    const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
    
    switch (type) {
      case 'mental_math':
        return generateMentalMathExercise(difficulty);
      case 'pattern_recognition':
        return generatePatternRecognitionExercise(difficulty);
      case 'memory_matrices':
        return generateMemoryMatrixExercise(difficulty);
      default:
        break;
    }
  }
  
  // Fall back to static database
  let filteredDatabase = database;
  if (type) {
    filteredDatabase = database.filter(exercise => exercise.type === type);
  }
  
  if (filteredDatabase.length === 0) {
    return database[0]; // Fallback to first exercise
  }
  
  const randomIndex = Math.floor(Math.random() * filteredDatabase.length);
  return filteredDatabase[randomIndex];
}

/**
 * Get exercises by difficulty
 * @param {Array} database - Exercise database
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Filtered exercises
 */
export function getBrainTrainingExercisesByDifficulty(database, difficulty) {
  return database.filter(exercise => exercise.difficulty === difficulty);
}

/**
 * Get exercises by type
 * @param {Array} database - Exercise database
 * @param {string} type - Exercise type
 * @returns {Array} Filtered exercises
 */
export function getBrainTrainingExercisesByType(database, type) {
  return database.filter(exercise => exercise.type === type);
}

/**
 * Calculate brain training progress
 * @param {number} currentIndex - Current exercise index
 * @param {number} totalLength - Total number of exercises
 * @returns {Object} Progress information
 */
export function calculateBrainTrainingProgress(currentIndex, totalLength) {
  const progress = Math.min(100, Math.max(0, (currentIndex / totalLength) * 100));
  return {
    current: currentIndex + 1,
    total: totalLength,
    percentage: Math.round(progress),
    isComplete: currentIndex >= totalLength - 1
  };
}

/**
 * Get brain training statistics
 * @param {Array} completedExercises - Array of completed exercises
 * @returns {Object} Statistics
 */
export function getBrainTrainingStatistics(completedExercises) {
  const totalExercises = completedExercises.length;
  const byType = {};
  const byDifficulty = {};
  
  completedExercises.forEach(exercise => {
    // Count by type
    byType[exercise.type] = (byType[exercise.type] || 0) + 1;
    
    // Count by difficulty
    byDifficulty[exercise.difficulty] = (byDifficulty[exercise.difficulty] || 0) + 1;
  });
  
  return {
    totalExercises,
    byType,
    byDifficulty,
    averageDifficulty: calculateAverageDifficulty(completedExercises)
  };
}

/**
 * Calculate average difficulty score
 * @param {Array} exercises - Array of exercises
 * @returns {number} Average difficulty (1-3 scale)
 */
function calculateAverageDifficulty(exercises) {
  if (exercises.length === 0) return 0;
  
  const difficultyScores = exercises.map(exercise => {
    switch (exercise.difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 2;
    }
  });
  
  const sum = difficultyScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / exercises.length) * 10) / 10;
}

/**
 * Validate user answer
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @returns {boolean} True if correct
 */
export function validateBrainTrainingAnswer(userAnswer, correctAnswer) {
  // Normalize answers for comparison
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();
  
  return normalizedUser === normalizedCorrect;
}

/**
 * Validate user answer with partial credit support
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {string} exerciseType - Type of exercise
 * @returns {Object} Validation result with partial credit info
 */
export function validateBrainTrainingAnswerWithPartialCredit(userAnswer, correctAnswer, exerciseType) {
  const normalizedUser = userAnswer.trim();
  const normalizedCorrect = correctAnswer.trim();
  
  // Exact match
  if (normalizedUser.toLowerCase() === normalizedCorrect.toLowerCase()) {
    return {
      isCorrect: true,
      isExact: true,
      partialCredit: 1.0,
      correctParts: [],
      incorrectParts: [],
      feedback: 'Perfect!'
    };
  }
  
  // Handle memory matrices with partial credit
  if (exerciseType === 'memory_matrices') {
    return validateMemoryMatrixAnswer(normalizedUser, normalizedCorrect);
  }
  
  // Handle other exercise types with partial credit
  if (exerciseType === 'mental_math' || exerciseType === 'financial_calculations') {
    return validateNumericAnswerWithPartialCredit(normalizedUser, normalizedCorrect);
  }
  
  // Default: no partial credit for other types
  return {
    isCorrect: false,
    isExact: false,
    partialCredit: 0.0,
    correctParts: [],
    incorrectParts: [],
    feedback: 'Incorrect'
  };
}

/**
 * Validate memory matrix answer with partial credit
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @returns {Object} Validation result
 */
function validateMemoryMatrixAnswer(userAnswer, correctAnswer) {
  const userNumbers = userAnswer.split(/\s+/).filter(n => n.trim() !== '');
  const correctNumbers = correctAnswer.split(/\s+/).filter(n => n.trim() !== '');
  
  const correctParts = [];
  const incorrectParts = [];
  
  // Compare each position
  for (let i = 0; i < Math.max(userNumbers.length, correctNumbers.length); i++) {
    const userNum = userNumbers[i] || '';
    const correctNum = correctNumbers[i] || '';
    
    if (userNum === correctNum) {
      correctParts.push({
        position: i,
        value: userNum,
        isCorrect: true
      });
    } else {
      incorrectParts.push({
        position: i,
        userValue: userNum,
        correctValue: correctNum,
        isCorrect: false
      });
    }
  }
  
  const partialCredit = correctParts.length / correctNumbers.length;
  const isCorrect = partialCredit >= 0.8; // 80% threshold for "correct"
  
  let feedback = '';
  if (isCorrect) {
    feedback = `Great! You got ${correctParts.length}/${correctNumbers.length} correct`;
  } else if (partialCredit > 0) {
    feedback = `Partial credit: ${correctParts.length}/${correctNumbers.length} correct`;
  } else {
    feedback = 'Try again - remember the order matters';
  }
  
  return {
    isCorrect,
    isExact: partialCredit === 1.0,
    partialCredit,
    correctParts,
    incorrectParts,
    feedback
  };
}

/**
 * Validate numeric answer with partial credit
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @returns {Object} Validation result
 */
function validateNumericAnswerWithPartialCredit(userAnswer, correctAnswer) {
  const userNum = parseFloat(userAnswer);
  const correctNum = parseFloat(correctAnswer);
  
  if (isNaN(userNum) || isNaN(correctNum)) {
    return {
      isCorrect: false,
      isExact: false,
      partialCredit: 0.0,
      correctParts: [],
      incorrectParts: [],
      feedback: 'Please enter a valid number'
    };
  }
  
  const difference = Math.abs(userNum - correctNum);
  const percentage = correctNum !== 0 ? (1 - difference / Math.abs(correctNum)) : (difference === 0 ? 1 : 0);
  
  let feedback = '';
  if (percentage >= 0.95) {
    feedback = 'Excellent! Very close to the exact answer';
  } else if (percentage >= 0.8) {
    feedback = 'Good! Close to the correct answer';
  } else if (percentage >= 0.5) {
    feedback = 'Getting there! You\'re on the right track';
  } else {
    feedback = 'Not quite right, but keep trying!';
  }
  
  return {
    isCorrect: percentage >= 0.8,
    isExact: percentage >= 0.95,
    partialCredit: Math.max(0, percentage),
    correctParts: [],
    incorrectParts: [],
    feedback
  };
}

/**
 * Get exercise hint
 * @param {Object} exercise - Exercise object
 * @returns {string} Hint text
 */
export function getBrainTrainingExerciseHint(exercise) {
  switch (exercise.type) {
    case 'mental_math':
      return 'Break it down into smaller steps';
    case 'pattern_recognition':
      return 'Look for mathematical relationships';
    case 'number_sequences':
      return 'Think about mathematical constants or sequences';
    case 'quick_logic':
      return 'Use logical deduction step by step';
    case 'financial_calculations':
      return 'Apply compound interest and percentage formulas';
    case 'memory_matrices':
      return 'Focus on patterns and groupings';
    case 'spatial_reasoning':
      return 'Visualize the problem step by step';
    case 'verbal_reasoning':
      return 'Analyze the logical relationships';
    case 'word_problems':
      return 'Break down the problem into smaller parts';
    default:
      return 'Think systematically';
  }
}
