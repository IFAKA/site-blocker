/**
 * Domain layer for Mind/Brain Exercises functionality
 * Pure business logic for brain exercises and cognitive training
 */

/**
 * Get the complete mind exercise database
 * @returns {Array} Array of mind exercise objects
 */
export function getMindExerciseDatabase() {
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
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 8 × 7?',
      answer: '56',
      explanation: '8 × 7 = 56',
      difficulty: 'easy'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 20% of 150',
      answer: '30',
      explanation: '20% of 150 = 0.20 × 150 = 30',
      difficulty: 'easy'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 9 × 6?',
      answer: '54',
      explanation: '9 × 6 = 54',
      difficulty: 'easy'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 12% of 200',
      answer: '24',
      explanation: '12% of 200 = 0.12 × 200 = 24',
      difficulty: 'medium'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 11 × 13?',
      answer: '143',
      explanation: '11 × 13 = 11 × 10 + 11 × 3 = 110 + 33 = 143',
      difficulty: 'medium'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 18% of 250',
      answer: '45',
      explanation: '18% of 250 = 0.18 × 250 = 45',
      difficulty: 'medium'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 14 × 8?',
      answer: '112',
      explanation: '14 × 8 = 10 × 8 + 4 × 8 = 80 + 32 = 112',
      difficulty: 'medium'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 22% of 180',
      answer: '39.6',
      explanation: '22% of 180 = 0.22 × 180 = 39.6',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 16 × 12?',
      answer: '192',
      explanation: '16 × 12 = 16 × 10 + 16 × 2 = 160 + 32 = 192',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 35% of 140',
      answer: '49',
      explanation: '35% of 140 = 0.35 × 140 = 49',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 13 × 15?',
      answer: '195',
      explanation: '13 × 15 = 13 × 10 + 13 × 5 = 130 + 65 = 195',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 28% of 125',
      answer: '35',
      explanation: '28% of 125 = 0.28 × 125 = 35',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 17 × 9?',
      answer: '153',
      explanation: '17 × 9 = 17 × 10 - 17 = 170 - 17 = 153',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'Calculate 42% of 80',
      answer: '33.6',
      explanation: '42% of 80 = 0.42 × 80 = 33.6',
      difficulty: 'hard'
    },
    {
      type: 'mental_math',
      category: 'Mental Math',
      question: 'What is 19 × 11?',
      answer: '209',
      explanation: '19 × 11 = 19 × 10 + 19 = 190 + 19 = 209',
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
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 3, 6, 10, 15, ?',
      answer: '21',
      explanation: 'Triangular numbers: 1, 1+2=3, 3+3=6, 6+4=10, 10+5=15, 15+6=21',
      difficulty: 'medium'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 2, 6, 12, 20, 30, ?',
      answer: '42',
      explanation: 'n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
      difficulty: 'hard'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 4, 9, 16, 25, 36, ?',
      answer: '49',
      explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6², 7²',
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
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 2, 4, 8, 16, 32, ?',
      answer: '64',
      explanation: 'Powers of 2: 2⁰, 2¹, 2², 2³, 2⁴, 2⁵, 2⁶',
      difficulty: 'easy'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 3, 7, 15, 31, ?',
      answer: '63',
      explanation: '2ⁿ-1: 2¹-1=1, 2²-1=3, 2³-1=7, 2⁴-1=15, 2⁵-1=31, 2⁶-1=63',
      difficulty: 'hard'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 0, 1, 1, 2, 3, 5, 8, 13, ?',
      answer: '21',
      explanation: 'Fibonacci sequence: each number is the sum of the two preceding numbers',
      difficulty: 'medium'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 4, 7, 10, 13, ?',
      answer: '16',
      explanation: 'Arithmetic sequence: add 3 each time (1+3=4, 4+3=7, etc.)',
      difficulty: 'easy'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 2, 5, 10, 17, 26, ?',
      answer: '37',
      explanation: 'n²+1: 1²+1=2, 2²+1=5, 3²+1=10, 4²+1=17, 5²+1=26, 6²+1=37',
      difficulty: 'hard'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 2, 6, 24, 120, ?',
      answer: '720',
      explanation: 'Factorials: 1!, 2!, 3!, 4!, 5!, 6!',
      difficulty: 'hard'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 3, 9, 27, 81, ?',
      answer: '243',
      explanation: 'Powers of 3: 3⁰, 3¹, 3², 3³, 3⁴, 3⁵',
      difficulty: 'medium'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 5, 14, 30, 55, ?',
      answer: '91',
      explanation: 'Pentagonal numbers: n(3n-1)/2',
      difficulty: 'hard'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 6, 15, 28, 45, ?',
      answer: '66',
      explanation: 'Hexagonal numbers: n(2n-1)',
      difficulty: 'hard'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 8, 27, 64, 125, 216, ?',
      answer: '343',
      explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³, 7³',
      difficulty: 'medium'
    },
    {
      type: 'pattern_recognition',
      category: 'Pattern Recognition',
      question: 'Next: 1, 4, 9, 16, 25, 36, 49, ?',
      answer: '64',
      explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6², 7², 8²',
      difficulty: 'easy'
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
      question: 'Remember: 2, 3, 5, 7, 11, 13, 17, 19',
      answer: 'Prime numbers',
      explanation: 'First 8 prime numbers',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 1, 2, 6, 24, 120, 720',
      answer: 'Factorials',
      explanation: '1!, 2!, 3!, 4!, 5!, 6!, 7!',
      difficulty: 'hard'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 4, 9, 16, 25, 36, 49, 64, 81',
      answer: 'Perfect squares',
      explanation: 'Squares of 1, 2, 3, 4, 5, 6, 7, 8, 9',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 8, 27, 64, 125, 216, 343, 512, 729',
      answer: 'Perfect cubes',
      explanation: 'Cubes of 1, 2, 3, 4, 5, 6, 7, 8, 9',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 1, 2, 3, 5, 8, 13, 21, 34',
      answer: 'Fibonacci sequence',
      explanation: 'Each number is the sum of the two preceding numbers',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 2, 6, 24, 120, 720, 5040, 40320, 362880',
      answer: 'Factorials',
      explanation: '1!, 2!, 3!, 4!, 5!, 6!, 7!, 8!, 9!',
      difficulty: 'hard'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29',
      answer: 'Prime numbers',
      explanation: 'First 10 prime numbers in sequence',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 4, 7, 10, 13, 16, 19, 22, 25',
      answer: 'Arithmetic sequence',
      explanation: 'Starting at 1, add 3 each time',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 3, 6, 10, 15, 21, 28, 36, 45',
      answer: 'Triangular numbers',
      explanation: 'n(n+1)/2: 1, 3, 6, 10, 15, 21, 28, 36, 45',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 5, 14, 30, 55, 91, 140, 204, 285',
      answer: 'Pentagonal numbers',
      explanation: 'n(3n-1)/2: pentagonal number sequence',
      difficulty: 'hard'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 6, 15, 28, 45, 66, 91, 120, 153',
      answer: 'Hexagonal numbers',
      explanation: 'n(2n-1): hexagonal number sequence',
      difficulty: 'hard'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 2, 4, 8, 16, 32, 64, 128, 256',
      answer: 'Powers of 2',
      explanation: '2⁰, 2¹, 2², 2³, 2⁴, 2⁵, 2⁶, 2⁷, 2⁸',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 3, 9, 27, 81, 243, 729, 2187, 6561',
      answer: 'Powers of 3',
      explanation: '3⁰, 3¹, 3², 3³, 3⁴, 3⁵, 3⁶, 3⁷, 3⁸',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100',
      answer: 'Perfect squares',
      explanation: 'Squares of 1 through 10',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000',
      answer: 'Perfect cubes',
      explanation: 'Cubes of 1 through 10',
      difficulty: 'medium'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024',
      answer: 'Powers of 2',
      explanation: '2¹, 2², 2³, 2⁴, 2⁵, 2⁶, 2⁷, 2⁸, 2⁹, 2¹⁰',
      difficulty: 'easy'
    },
    {
      type: 'number_sequences',
      category: 'Number Sequences',
      question: 'Remember: 1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880',
      answer: 'Factorials',
      explanation: '1!, 1!, 2!, 3!, 4!, 5!, 6!, 7!, 8!, 9!',
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
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If no fish can fly and Nemo is a fish, what can we conclude?',
      answer: 'Nemo cannot fly',
      explanation: 'No A can B, and X is A, so X cannot B',
      difficulty: 'easy'
    },
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
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '6 2 8 4 9 1 7 3 5',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[6, 2, 8], [4, 9, 1], [7, 3, 5]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '2 8 4 9 1 6 5 3 7',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[2, 8, 4], [9, 1, 6], [5, 3, 7]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '8 3 6 1 5 9 4 7 2',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[8, 3, 6], [1, 5, 9], [4, 7, 2]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '5 1 8 3 9 4 6 2 7',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[5, 1, 8], [3, 9, 4], [6, 2, 7]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '4 7 1 9 2 6 8 5 3',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[4, 7, 1], [9, 2, 6], [8, 5, 3]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '7 4 2 1 8 5 9 6 3',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[7, 4, 2], [1, 8, 5], [9, 6, 3]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '3 6 9 2 5 8 1 4 7',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[3, 6, 9], [2, 5, 8], [1, 4, 7]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '8 1 5 4 9 3 6 2 7',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[8, 1, 5], [4, 9, 3], [6, 2, 7]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '2 9 4 7 1 6 5 8 3',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[2, 9, 4], [7, 1, 6], [5, 8, 3]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '6 3 8 1 7 4 9 2 5',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[6, 3, 8], [1, 7, 4], [9, 2, 5]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '4 8 2 6 1 9 3 5 7',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[4, 8, 2], [6, 1, 9], [3, 5, 7]]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '9 2 6 5 8 1 4 7 3',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [[9, 2, 6], [5, 8, 1], [4, 7, 3]]
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
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If no cats are dogs and Fluffy is a cat, what can we conclude?',
      answer: 'Fluffy is not a dog',
      explanation: 'If no cats are dogs, then Fluffy (being a cat) cannot be a dog',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all birds can fly and penguins are birds, what can we conclude?',
      answer: 'Penguins can fly',
      explanation: 'This is a logical conclusion from the premises (though factually incorrect)',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If some students are athletes and Maria is a student, what can we conclude?',
      answer: 'Maria might be an athlete',
      explanation: 'We cannot definitively conclude Maria is an athlete since only "some" students are athletes',
      difficulty: 'medium'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all roses are flowers and this is a rose, what can we conclude?',
      answer: 'This is a flower',
      explanation: 'If all roses are flowers, then this rose must be a flower',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If no fish can fly and Nemo is a fish, what can we conclude?',
      answer: 'Nemo cannot fly',
      explanation: 'If no fish can fly, then Nemo (being a fish) cannot fly',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all doctors are smart and Dr. Smith is a doctor, what can we conclude?',
      answer: 'Dr. Smith is smart',
      explanation: 'If all doctors are smart, then Dr. Smith (being a doctor) must be smart',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If some cars are red and this is a car, what can we conclude?',
      answer: 'This car might be red',
      explanation: 'We cannot definitively conclude this car is red since only "some" cars are red',
      difficulty: 'medium'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all triangles have three sides and this shape has three sides, what can we conclude?',
      answer: 'This shape is a triangle',
      explanation: 'If all triangles have three sides, then any shape with three sides must be a triangle',
      difficulty: 'medium'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If no squares are circles and this is a square, what can we conclude?',
      answer: 'This is not a circle',
      explanation: 'If no squares are circles, then this square cannot be a circle',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all mammals are warm-blooded and whales are mammals, what can we conclude?',
      answer: 'Whales are warm-blooded',
      explanation: 'If all mammals are warm-blooded, then whales (being mammals) must be warm-blooded',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If some books are fiction and this is a book, what can we conclude?',
      answer: 'This book might be fiction',
      explanation: 'We cannot definitively conclude this book is fiction since only "some" books are fiction',
      difficulty: 'medium'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all rectangles have four sides and this shape has four sides, what can we conclude?',
      answer: 'This shape might be a rectangle',
      explanation: 'Having four sides is necessary but not sufficient to be a rectangle (could be a square, rhombus, etc.)',
      difficulty: 'hard'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If no prime numbers are even (except 2) and 7 is prime, what can we conclude?',
      answer: '7 is not even',
      explanation: 'If no prime numbers are even (except 2), then 7 (being prime and not 2) cannot be even',
      difficulty: 'medium'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If all squares are rectangles and this is a square, what can we conclude?',
      answer: 'This is a rectangle',
      explanation: 'If all squares are rectangles, then this square must be a rectangle',
      difficulty: 'easy'
    },
    {
      type: 'quick_logic',
      category: 'Quick Logic',
      question: 'If some students study hard and Alex is a student, what can we conclude?',
      answer: 'Alex might study hard',
      explanation: 'We cannot definitively conclude Alex studies hard since only "some" students study hard',
      difficulty: 'medium'
    },

    // Memory Matrices exercises
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '7 2 9 4 1 6 8 3 5',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'medium',
      matrix: [
        [7, 2, 9],
        [4, 1, 6],
        [8, 3, 5]
      ]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '1 2 3 4 5 6 7 8 9',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'easy',
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]
    },
    {
      type: 'memory_matrices',
      category: 'Memory Matrices',
      question: 'Remember this 3×3 grid (type the numbers in order, separated by spaces):',
      answer: '15 8 23 42 7 19 31 14 6',
      explanation: 'Memory exercise - type the numbers in order from left to right, top to bottom',
      difficulty: 'hard',
      matrix: [
        [15, 8, 23],
        [42, 7, 19],
        [31, 14, 6]
      ]
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Portfolio: 60% stocks (+8%), 40% bonds (+3%), weighted return?',
      answer: '+6%',
      explanation: 'Weighted return = 0.6×8% + 0.4×3% = 4.8% + 1.2% = 6%',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Investment doubles in 7 years, annual return?',
      answer: '+10.4%',
      explanation: 'Rule of 72: 72/7 ≈ 10.3%, or (2^(1/7)-1) ≈ 10.4%',
      difficulty: 'hard'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Stock: $100 → $120 → $90, total return?',
      answer: '-10%',
      explanation: 'Total return = (90-100)/100 = -10%',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Dividend yield 2%, stock price $50, annual dividend?',
      answer: '$1.00',
      explanation: 'Annual dividend = $50 × 2% = $1.00',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Portfolio: 70% stocks (+12%), 30% bonds (+4%), weighted return?',
      answer: '+9.6%',
      explanation: 'Weighted return = 0.7×12% + 0.3×4% = 8.4% + 1.2% = 9.6%',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Bond: 5% coupon, 4% yield, price vs par?',
      answer: 'Above par',
      explanation: 'When coupon > yield, bond trades above par (premium)',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Stock: $80 → $100 → $85, total return?',
      answer: '+6.25%',
      explanation: 'Total return = (85-80)/80 = 5/80 = 6.25%',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Portfolio: 50% stocks (+10%), 50% bonds (+2%), weighted return?',
      answer: '+6%',
      explanation: 'Weighted return = 0.5×10% + 0.5×2% = 5% + 1% = 6%',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Investment: $1000 → $1500 in 3 years, annual return?',
      answer: '+14.5%',
      explanation: 'Annual return = (1500/1000)^(1/3) - 1 = 1.5^(1/3) - 1 ≈ 14.5%',
      difficulty: 'hard'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Stock: $50 → $60 → $45, total return?',
      answer: '-10%',
      explanation: 'Total return = (45-50)/50 = -5/50 = -10%',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Portfolio: 80% stocks (+15%), 20% bonds (+3%), weighted return?',
      answer: '+12.6%',
      explanation: 'Weighted return = 0.8×15% + 0.2×3% = 12% + 0.6% = 12.6%',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Bond yield 6%, inflation 2%, real return?',
      answer: '+4%',
      explanation: 'Real return = Nominal return - Inflation = 6% - 2% = 4%',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Stock: $100 → $110 → $95, total return?',
      answer: '-5%',
      explanation: 'Total return = (95-100)/100 = -5/100 = -5%',
      difficulty: 'easy'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Portfolio: 40% stocks (+20%), 60% bonds (+5%), weighted return?',
      answer: '+11%',
      explanation: 'Weighted return = 0.4×20% + 0.6×5% = 8% + 3% = 11%',
      difficulty: 'medium'
    },
    {
      type: 'financial_calculations',
      category: 'Financial Calculations',
      question: 'Investment triples in 10 years, annual return?',
      answer: '+11.6%',
      explanation: 'Annual return = (3^(1/10)) - 1 ≈ 11.6%',
      difficulty: 'hard'
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
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Bond: $1000 par, 5% coupon, 4% yield. Price?',
      answer: '$1042',
      explanation: 'When coupon > yield, bond trades above par. Price ≈ $1000 + (5%-4%)×$1000 = $1042',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Portfolio: 60% stocks (+12%), 30% bonds (+4%), 10% cash (0%). Weighted return?',
      answer: '+8.4%',
      explanation: 'Weighted return = 0.6×12% + 0.3×4% + 0.1×0% = 7.2% + 1.2% + 0% = 8.4%',
      difficulty: 'medium'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Investment: $5000 → $7500 in 5 years. Annual return?',
      answer: '+8.4%',
      explanation: 'Annual return = (7500/5000)^(1/5) - 1 = 1.5^(1/5) - 1 ≈ 8.4%',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Stock: $80 → $100 → $85 → $95. Total return?',
      answer: '+18.75%',
      explanation: 'Final value $95, initial $80, return = ($95-$80)/$80 = 15/80 = 18.75%',
      difficulty: 'medium'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Portfolio: $20k stocks (+10%), $10k bonds (+2%), $10k cash (0%). Total return?',
      answer: '+7.5%',
      explanation: 'Total value: $20k×1.10 + $10k×1.02 + $10k×1.00 = $22k + $10.2k + $10k = $42.2k. Return = ($42.2k-$40k)/$40k = 5.5%',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Bond: $1000 par, 6% coupon, 5% yield. Price?',
      answer: '$1019',
      explanation: 'When coupon > yield, bond trades above par. Price ≈ $1000 + (6%-5%)×$1000 = $1019',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Investment: $2000 → $3000 in 4 years. Annual return?',
      answer: '+10.7%',
      explanation: 'Annual return = (3000/2000)^(1/4) - 1 = 1.5^(1/4) - 1 ≈ 10.7%',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Stock: $60 → $70 → $65 → $75. Total return?',
      answer: '+25%',
      explanation: 'Final value $75, initial $60, return = ($75-$60)/$60 = 15/60 = 25%',
      difficulty: 'easy'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Portfolio: 70% stocks (+8%), 20% bonds (+3%), 10% cash (0%). Weighted return?',
      answer: '+6.2%',
      explanation: 'Weighted return = 0.7×8% + 0.2×3% + 0.1×0% = 5.6% + 0.6% + 0% = 6.2%',
      difficulty: 'medium'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Investment: $1000 → $2000 in 6 years. Annual return?',
      answer: '+12.2%',
      explanation: 'Annual return = (2000/1000)^(1/6) - 1 = 2^(1/6) - 1 ≈ 12.2%',
      difficulty: 'hard'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Stock: $40 → $50 → $45 → $55. Total return?',
      answer: '+37.5%',
      explanation: 'Final value $55, initial $40, return = ($55-$40)/$40 = 15/40 = 37.5%',
      difficulty: 'medium'
    },
    {
      type: 'word_problems',
      category: 'Word Problems',
      question: 'Portfolio: $15k stocks (+12%), $10k bonds (+4%), $5k cash (0%). Total return?',
      answer: '+8.67%',
      explanation: 'Total value: $15k×1.12 + $10k×1.04 + $5k×1.00 = $16.8k + $10.4k + $5k = $32.2k. Return = ($32.2k-$30k)/$30k = 7.33%',
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
      },
      () => {
        const base = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
        const sequence = [base, base*base, base*base*base, base*base*base*base];
        const next = base*base*base*base*base;
        return {
          type: 'pattern_recognition',
          category: 'Pattern Recognition',
          question: `Next: ${sequence.join(', ')}?`,
          answer: next.toString(),
          explanation: `Powers of ${base}: ${base}¹, ${base}², ${base}³, ${base}⁴, ${base}⁵`,
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
      },
      () => {
        const n = Math.floor(Math.random() * 5) + 3;
        const sequence = [n*n, (n+1)*(n+1), (n+2)*(n+2), (n+3)*(n+3)];
        const next = (n+4)*(n+4);
        return {
          type: 'pattern_recognition',
          category: 'Pattern Recognition',
          question: `Next: ${sequence.join(', ')}?`,
          answer: next.toString(),
          explanation: `Perfect squares: ${n}², ${n+1}², ${n+2}², ${n+3}², ${n+4}²`,
          difficulty: 'medium'
        };
      }
    ],
    hard: [
      () => {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
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
      },
      () => {
        const n = Math.floor(Math.random() * 5) + 3;
        const sequence = [n*n*n, (n+1)*(n+1)*(n+1), (n+2)*(n+2)*(n+2), (n+3)*(n+3)*(n+3)];
        const next = (n+4)*(n+4)*(n+4);
        return {
          type: 'pattern_recognition',
          category: 'Pattern Recognition',
          question: `Next: ${sequence.join(', ')}?`,
          answer: next.toString(),
          explanation: `Perfect cubes: ${n}³, ${n+1}³, ${n+2}³, ${n+3}³, ${n+4}³`,
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
 * Generate dynamic financial calculation exercise
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {Object} Generated exercise
 */
export function generateFinancialExercise(difficulty = 'easy') {
  const exercises = {
    easy: [
      () => {
        const stockPrice = Math.floor(Math.random() * 50) + 50; // $50-$100
        const changePercent = Math.floor(Math.random() * 20) + 5; // 5-25%
        const newPrice = stockPrice * (1 + changePercent / 100);
        return {
          type: 'financial_calculations',
          category: 'Financial Calculations',
          question: `Stock: $${stockPrice} → $${newPrice.toFixed(0)}, total return?`,
          answer: `+${changePercent}%`,
          explanation: `Total return = ($${newPrice.toFixed(0)} - $${stockPrice}) / $${stockPrice} = ${changePercent}%`,
          difficulty: 'easy'
        };
      },
      () => {
        const yieldRate = Math.floor(Math.random() * 5) + 3; // 3-8%
        const inflation = Math.floor(Math.random() * 3) + 1; // 1-4%
        const realReturn = yieldRate - inflation;
        return {
          type: 'financial_calculations',
          category: 'Financial Calculations',
          question: `Bond yield ${yieldRate}%, inflation ${inflation}%, real return?`,
          answer: `+${realReturn}%`,
          explanation: `Real return = Nominal return - Inflation = ${yieldRate}% - ${inflation}% = ${realReturn}%`,
          difficulty: 'easy'
        };
      }
    ],
    medium: [
      () => {
        const stockPrice = Math.floor(Math.random() * 100) + 100; // $100-$200
        const changePercent = Math.floor(Math.random() * 30) + 10; // 10-40%
        const newPrice = stockPrice * (1 + changePercent / 100);
        return {
          type: 'financial_calculations',
          category: 'Financial Calculations',
          question: `Stock: $${stockPrice} → $${newPrice.toFixed(0)}, total return?`,
          answer: `+${changePercent}%`,
          explanation: `Total return = ($${newPrice.toFixed(0)} - $${stockPrice}) / $${stockPrice} = ${changePercent}%`,
          difficulty: 'medium'
        };
      },
      () => {
        const stockWeight = Math.floor(Math.random() * 40) + 40; // 40-80%
        const bondWeight = 100 - stockWeight;
        const stockReturn = Math.floor(Math.random() * 15) + 5; // 5-20%
        const bondReturn = Math.floor(Math.random() * 8) + 2; // 2-10%
        const weightedReturn = (stockWeight * stockReturn + bondWeight * bondReturn) / 100;
        return {
          type: 'financial_calculations',
          category: 'Financial Calculations',
          question: `Portfolio: ${stockWeight}% stocks (+${stockReturn}%), ${bondWeight}% bonds (+${bondReturn}%), weighted return?`,
          answer: `+${weightedReturn.toFixed(1)}%`,
          explanation: `Weighted return = ${stockWeight/100}×${stockReturn}% + ${bondWeight/100}×${bondReturn}% = ${weightedReturn.toFixed(1)}%`,
          difficulty: 'medium'
        };
      }
    ],
    hard: [
      () => {
        const initialValue = Math.floor(Math.random() * 5000) + 1000; // $1000-$6000
        const finalValue = Math.floor(Math.random() * 5000) + initialValue; // $1000+ more
        const years = Math.floor(Math.random() * 5) + 3; // 3-8 years
        const annualReturn = Math.pow(finalValue / initialValue, 1/years) - 1;
        return {
          type: 'financial_calculations',
          category: 'Financial Calculations',
          question: `Investment: $${initialValue} → $${finalValue} in ${years} years. Annual return?`,
          answer: `+${(annualReturn * 100).toFixed(1)}%`,
          explanation: `Annual return = (${finalValue}/${initialValue})^(1/${years}) - 1 = ${(annualReturn * 100).toFixed(1)}%`,
          difficulty: 'hard'
        };
      },
      () => {
        const stockWeight = Math.floor(Math.random() * 30) + 50; // 50-80%
        const bondWeight = Math.floor(Math.random() * 30) + 10; // 10-40%
        const cashWeight = 100 - stockWeight - bondWeight;
        const stockReturn = Math.floor(Math.random() * 20) + 10; // 10-30%
        const bondReturn = Math.floor(Math.random() * 10) + 2; // 2-12%
        const weightedReturn = (stockWeight * stockReturn + bondWeight * bondReturn) / 100;
        return {
          type: 'financial_calculations',
          category: 'Financial Calculations',
          question: `Portfolio: ${stockWeight}% stocks (+${stockReturn}%), ${bondWeight}% bonds (+${bondReturn}%), ${cashWeight}% cash (0%). Weighted return?`,
          answer: `+${weightedReturn.toFixed(1)}%`,
          explanation: `Weighted return = ${stockWeight/100}×${stockReturn}% + ${bondWeight/100}×${bondReturn}% + ${cashWeight/100}×0% = ${weightedReturn.toFixed(1)}%`,
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
 * Get random exercise from database or generate dynamic one
 * @param {Array} database - Exercise database
 * @param {string} type - Exercise type filter (optional)
 * @returns {Object} Random exercise
 */
export function getRandomExercise(database, type = null) {
  // Check if we should generate a dynamic exercise
  const dynamicTypes = ['mental_math', 'pattern_recognition', 'memory_matrices', 'financial_calculations'];
  
  if (type && dynamicTypes.includes(type)) {
    const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
    
    switch (type) {
      case 'mental_math':
        return generateMentalMathExercise(difficulty);
      case 'pattern_recognition':
        return generatePatternRecognitionExercise(difficulty);
      case 'memory_matrices':
        return generateMemoryMatrixExercise(difficulty);
      case 'financial_calculations':
        return generateFinancialExercise(difficulty);
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
export function getExercisesByDifficulty(database, difficulty) {
  return database.filter(exercise => exercise.difficulty === difficulty);
}

/**
 * Get exercises by type
 * @param {Array} database - Exercise database
 * @param {string} type - Exercise type
 * @returns {Array} Filtered exercises
 */
export function getExercisesByType(database, type) {
  return database.filter(exercise => exercise.type === type);
}

/**
 * Calculate mind exercise progress
 * @param {number} currentIndex - Current exercise index
 * @param {number} totalLength - Total number of exercises
 * @returns {Object} Progress information
 */
export function calculateMindProgress(currentIndex, totalLength) {
  const progress = Math.min(100, Math.max(0, (currentIndex / totalLength) * 100));
  return {
    current: currentIndex + 1,
    total: totalLength,
    percentage: Math.round(progress),
    isComplete: currentIndex >= totalLength - 1
  };
}

/**
 * Get mind exercise statistics
 * @param {Array} completedExercises - Array of completed exercises
 * @returns {Object} Statistics
 */
export function getMindStatistics(completedExercises) {
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
export function validateAnswer(userAnswer, correctAnswer) {
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
export function validateAnswerWithPartialCredit(userAnswer, correctAnswer, exerciseType) {
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
export function getExerciseHint(exercise) {
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
    default:
      return 'Think systematically';
  }
}
