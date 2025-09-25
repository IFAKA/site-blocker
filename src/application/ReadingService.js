/**
 * Application layer for Reading operations
 * Business logic for reading and RSVP functionality
 */

import { normalizeTextToParagraphs, countWords, computeChunk, calculateReadingTime, calculateWordInterval, splitTextIntoWords, validateWPM, calculateReadingProgress } from '../domain/Reading.js';
import { getReadingPointer, setReadingPointer, getReadingWPM, setReadingWPM, getBookMeta, setBookMeta } from '../infrastructure/Storage.js';

// Store book text in memory to avoid localStorage limits
let __BOOK_TEXT__ = '';

/**
 * Load book text from file
 * @param {boolean} force - Force reload even if already loaded
 * @returns {Promise<string>} Book text content
 */
export async function loadBookText(force = false) {
  if (!force && __BOOK_TEXT__) {
    return __BOOK_TEXT__;
  }
  
  try {
    const attempted = [];
    const urls = [];
    
    // Try different URL patterns
    try { 
      urls.push(chrome.runtime.getURL('book.txt')); 
    } catch {}
    urls.push('/book.txt');
    urls.push('book.txt');
    
    let text = '';
    let lastError = '';
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      attempted.push(url);
      
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (response && response.ok) {
          text = await response.text();
          break;
        }
        lastError = `status ${response && response.status}`;
      } catch (error) {
        lastError = String(error);
      }
    }
    
    if (text) {
      __BOOK_TEXT__ = text;
      setBookMeta(text.length);
      return text;
    } else {
      console.warn('Reader could not fetch book.txt. Tried URLs:', attempted, 'Last error:', lastError);
      return '';
    }
  } catch (error) {
    console.warn('Failed to load book text:', error);
    return '';
  }
}

/**
 * Get stored book text
 * @returns {string} Book text
 */
export function getStoredBookText() {
  return __BOOK_TEXT__ || '';
}

/**
 * Set stored book text
 * @param {string} text - Book text
 * @returns {boolean} Success status
 */
export function setStoredBookText(text) {
  __BOOK_TEXT__ = text || '';
  try {
    setBookMeta(__BOOK_TEXT__.length);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current reading pointer
 * @returns {number} Current pointer
 */
export function getCurrentReadingPointer() {
  return getReadingPointer();
}

/**
 * Set current reading pointer
 * @param {number} pointer - Reading pointer
 * @returns {boolean} Success status
 */
export function setCurrentReadingPointer(pointer) {
  return setReadingPointer(pointer);
}

/**
 * Get current reading WPM
 * @returns {number} Words per minute
 */
export function getCurrentReadingWPM() {
  return getReadingWPM();
}

/**
 * Set current reading WPM
 * @param {number} wpm - Words per minute
 * @returns {boolean} Success status
 */
export function setCurrentReadingWPM(wpm) {
  const clampedWPM = validateWPM(wpm);
  return setReadingWPM(clampedWPM);
}

/**
 * Get reading progress
 * @returns {Object} Reading progress information
 */
export function getReadingProgress() {
  const text = getStoredBookText();
  if (!text) return { current: 0, total: 0, percentage: 0 };
  
  const paragraphs = normalizeTextToParagraphs(text);
  const currentPointer = getCurrentReadingPointer();
  
  return calculateReadingProgress(currentPointer, paragraphs.length);
}

/**
 * Get current reading chunk
 * @returns {Object|null} Current reading chunk
 */
export function getCurrentReadingChunk() {
  const text = getStoredBookText();
  if (!text) return null;
  
  const paragraphs = normalizeTextToParagraphs(text);
  const currentPointer = getCurrentReadingPointer();
  const wpm = getCurrentReadingWPM();
  
  return computeChunk(paragraphs, currentPointer, wpm);
}

/**
 * Move to next reading chunk
 * @returns {boolean} Success status
 */
export function moveToNextReadingChunk() {
  const chunk = getCurrentReadingChunk();
  if (!chunk) return false;
  
  return setCurrentReadingPointer(chunk.nextPointer);
}

/**
 * Get reading statistics
 * @returns {Object} Reading statistics
 */
export function getReadingStatistics() {
  const text = getStoredBookText();
  if (!text) return { totalWords: 0, totalParagraphs: 0, estimatedTime: 0 };
  
  const paragraphs = normalizeTextToParagraphs(text);
  const totalWords = countWords(text);
  const wpm = getCurrentReadingWPM();
  const estimatedTime = calculateReadingTime(totalWords, wpm);
  
  return {
    totalWords,
    totalParagraphs: paragraphs.length,
    estimatedTime,
    wpm
  };
}

/**
 * Calculate reading session timing
 * @param {number} words - Number of words to read
 * @returns {Object} Timing information
 */
export function calculateReadingSessionTiming(words) {
  const wpm = getCurrentReadingWPM();
  const totalTime = calculateReadingTime(words, wpm);
  const wordInterval = calculateWordInterval(wpm);
  
  return {
    words,
    wpm,
    totalTime,
    wordInterval
  };
}

/**
 * Split text into words for RSVP
 * @param {string} text - Text to split
 * @returns {Array} Array of words
 */
export function splitTextForRSVP(text) {
  return splitTextIntoWords(text);
}
