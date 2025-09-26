/**
 * Application constants
 * Centralized configuration and constants
 */

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  INTENT: 'site-blocker:intent',
  JOURNAL: 'site-blocker:journal',
  ROUTINE_INDEX: 'site-blocker:routine:index',
  BOOK_META: 'site-blocker:reader:book:len',
  READER_POINTER: 'site-blocker:reader:pointer',
  READER_WPM: 'site-blocker:reader:wpm',
  CHINESE_PROGRESS: 'site-blocker:chinese:progress'
};

/**
 * Default application settings
 */
export const DEFAULT_SETTINGS = {
  WPM: 250,
  MIN_WPM: 60,
  MAX_WPM: 1200,
  JOURNAL_LIMIT: 200,
  EXERCISE_TEMPO: 4, // seconds per rep
  EXERCISE_REST: 75, // seconds between sets
  EXERCISE_BREAK: 120, // seconds between exercises
  PRAYER_DURATION: 60, // seconds
  READING_DURATION: 60, // seconds
  MAX_UNDO_STACK: 20
};

/**
 * Keyboard shortcuts mapping
 */
export const KEYBOARD_SHORTCUTS = {
  // Global shortcuts
  PRAYER: 'p',
  READING: 'r',
  EXERCISE: 's',
  JOURNAL: 'j',
  INTENT: 'i',
  LIST_MODE: 'l',
  DOODLE: 'd',
  EYE_HEALTH: 'e',
  MIND: 'm',
  CHINESE: 'c',
  MIRROR: 'v',
  
  // Intent shortcuts
  SAVE_INTENT: 'enter',
  CLEAR_INTENT: 'x',
  
  // Exercise shortcuts
  EXERCISE_SKIP: 'n',
  EXERCISE_RESET: 't',
  
  // Eye health shortcuts
  EYE_SKIP: 'n',
  EYE_RESET: 't',
  
  // Modal shortcuts
  CLOSE: 'q',
  ESCAPE: 'escape',
  
  // Reading modal
  START_PAUSE: ' ',
  SKIP_CHUNK: 'l',
  WPM_UP: 'k',
  WPM_DOWN: 'j',
  
  // Drawing modal
  ZOOM_IN: '=',
  ZOOM_OUT: '-',
  ZOOM_IN_FAST: 'cmd+=',
  ZOOM_OUT_FAST: 'cmd+-',
  UNDO: 'z',
  REDO: 'y',
  RESET: 'r',
  SAVE: 's',
  COPY: 'c',
  
  // List mode
  MOVE_DOWN: 'j',
  MOVE_UP: 'k',
  COPY_SELECTED: 'c',
  
  // Paragraph selection
  TOGGLE_SELECTION: 'v',
  START_OF_LINE: '0',
  END_OF_LINE: '$',
  MOVE_LEFT: 'h',
  MOVE_RIGHT: 'l',
  NEXT_WORD: 'w',
  PREV_WORD: 'b',
  NEXT_SENTENCE: 's',
  PREV_SENTENCE: 'a',
  COPY_SELECTION: 'c',
  TO_JOURNAL: 'j',
  
  // Chinese learning shortcuts
  CHINESE_RECORD: 's',
  CHINESE_PLAY: 'r',
  CHINESE_NEXT: 'n',
  CHINESE_PREV: 'p'
};

/**
 * Exercise routine data
 */
export const EXERCISE_ROUTINE = [
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

/**
 * Audio configuration
 */
export const AUDIO_CONFIG = {
  BEEP_FREQUENCY: 880,
  BEEP_DURATION: 160,
  SUCCESS_FREQUENCY: 1200,
  SUCCESS_DURATION: 220,
  ERROR_FREQUENCY: 400,
  ERROR_DURATION: 200
};

/**
 * UI configuration
 */
export const UI_CONFIG = {
  MODAL_Z_INDEX: 10000,
  OVERLAY_Z_INDEX: 9999,
  FEEDBACK_Z_INDEX: 10001,
  ANIMATION_DURATION: 300,
  FEEDBACK_DURATION: 1000
};

/**
 * Canvas configuration
 */
export const CANVAS_CONFIG = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  DEFAULT_ZOOM: 1,
  ZOOM_STEP: 0.1,
  ZOOM_STEP_FAST: 0.2,
  DEFAULT_STROKE_WIDTH: 2,
  DEFAULT_STROKE_COLOR: '#000000',
  BACKGROUND_COLOR: '#ffffff',
  // Theme-aware colors
  LIGHT_THEME: {
    BACKGROUND_COLOR: '#ffffff',
    STROKE_COLOR: '#000000'
  },
  DARK_THEME: {
    BACKGROUND_COLOR: '#1a1a1a',
    STROKE_COLOR: '#ffffff'
  }
};
