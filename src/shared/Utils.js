/**
 * Shared utility functions
 * Common helper functions used across the application
 */

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
}

/**
 * Format timestamp for display
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted timestamp
 */
export function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return 'Invalid date';
  }
}

/**
 * Parse URL safely
 * @param {string} urlString - URL string to parse
 * @returns {URL|null} Parsed URL or null if invalid
 */
export function parseUrl(urlString) {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

/**
 * Extract domain from URL string
 * @param {string} urlString - URL string
 * @returns {string} Domain name or empty string
 */
export function extractDomain(urlString) {
  const url = parseUrl(urlString);
  return url ? url.hostname : '';
}

/**
 * Check if a character is a word character
 * @param {string} char - Character to check
 * @returns {boolean} True if word character
 */
export function isWordChar(char) {
  return /[A-Za-z0-9_]/.test(char);
}

/**
 * Find next word index in text
 * @param {string} text - Text to search
 * @param {number} startIndex - Starting index
 * @returns {number} Next word index
 */
export function findNextWordIndex(text, startIndex) {
  let i = clamp(startIndex, 0, text.length);
  // skip current word/non-word then advance to start of next word
  while (i < text.length && isWordChar(text[i])) i++;
  while (i < text.length && !isWordChar(text[i])) i++;
  return i;
}

/**
 * Find previous word index in text
 * @param {string} text - Text to search
 * @param {number} startIndex - Starting index
 * @returns {number} Previous word index
 */
export function findPrevWordIndex(text, startIndex) {
  let i = clamp(startIndex, 0, text.length);
  // move left skipping spaces/non-word
  while (i > 0 && !isWordChar(text[i-1])) i--;
  // then move to start of current word
  while (i > 0 && isWordChar(text[i-1])) i--;
  return i;
}

/**
 * Check if character is sentence punctuation
 * @param {string} char - Character to check
 * @returns {boolean} True if sentence punctuation
 */
export function isSentencePunct(char) {
  return /[\.\!\?]/.test(char);
}

/**
 * Get token before index in text
 * @param {string} text - Text to search
 * @param {number} index - Current index
 * @returns {string} Token before index
 */
export function getTokenBefore(text, index) {
  let i = Math.max(0, index-1);
  // skip spaces and quotes
  while (i > 0 && /[\s"'\)\]]/.test(text[i])) i--;
  // collect letters before dot
  let start = i;
  while (start > 0 && /[A-Za-z]/.test(text[start-1])) start--;
  return text.slice(start, i+1).toLowerCase();
}

/**
 * Check if position looks like sentence boundary
 * @param {string} text - Text to check
 * @param {number} index - Position in text
 * @returns {boolean} True if sentence boundary
 */
export function looksLikeSentenceBoundary(text, index) {
  const ABBREV = new Set(['mr','mrs','ms','dr','prof','sr','jr','st','vs','etc','e.g','i.e','fr','rev']);
  
  // i points at punctuation; check abbreviation before and capitalization after
  const prevTok = getTokenBefore(text, index);
  if (ABBREV.has(prevTok.replace(/\.$/, ''))) return false;
  
  // Next non-space character should be uppercase letter to count as boundary
  let j = index+1;
  while (j < text.length && /\s/.test(text[j])) j++;
  if (j < text.length && /[A-Z]/.test(text[j])) return true;
  return /[\n]/.test(text[j] || '');
}

/**
 * Find next sentence index
 * @param {string} text - Text to search
 * @param {number} startIndex - Starting index
 * @returns {number} Next sentence index
 */
export function findNextSentenceIndex(text, startIndex) {
  let i = clamp(startIndex, 0, text.length);
  while (i < text.length) {
    if (isSentencePunct(text[i]) && looksLikeSentenceBoundary(text, i)) {
      i++;
      while (i < text.length && /\s/.test(text[i])) i++;
      break;
    }
    i++;
  }
  return i;
}

/**
 * Find previous sentence index
 * @param {string} text - Text to search
 * @param {number} startIndex - Starting index
 * @returns {number} Previous sentence index
 */
export function findPrevSentenceIndex(text, startIndex) {
  let i = clamp(startIndex, 0, text.length);
  // move left skipping spaces
  while (i > 0 && /\s/.test(text[i-1])) i--;
  // find previous sentence boundary
  let k = i-1;
  while (k > 0) {
    if (isSentencePunct(text[k]) && looksLikeSentenceBoundary(text, k)) { 
      k--; 
      break; 
    }
    k--;
  }
  // jump to start after that boundary
  let start = k+1;
  while (start < text.length && /\s/.test(text[start])) start++;
  return clamp(start, 0, text.length);
}
