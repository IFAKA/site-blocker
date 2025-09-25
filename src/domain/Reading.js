/**
 * Domain layer for Reading functionality
 * Pure business logic for reading and RSVP
 */

/**
 * Normalize text into paragraphs
 * @param {string} text - Raw text content
 * @returns {Array} Array of paragraph strings
 */
export function normalizeTextToParagraphs(text) {
  const cleaned = (text || '').replace(/\r\n?/g, '\n');
  const paras = cleaned.split(/\n\s*\n+/).map(s => s.trim()).filter(Boolean);
  return paras;
}

/**
 * Count words in a string
 * @param {string} text - Text to count words in
 * @returns {number} Word count
 */
export function countWords(text) {
  return (text.match(/\b\w+\b/g) || []).length;
}

/**
 * Compute reading chunk based on WPM and time budget
 * @param {Array} paragraphs - Array of paragraph strings
 * @param {number} pointer - Current position in paragraphs
 * @param {number} wpm - Words per minute
 * @returns {Object} Chunk information
 */
export function computeChunk(paragraphs, pointer, wpm) {
  const wordsPerMinute = Math.max(60, wpm);
  const wordsBudget = wordsPerMinute; // 1 minute budget
  let acc = [];
  let totalWords = 0;
  let idx = pointer % Math.max(1, paragraphs.length);
  
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[idx];
    const wc = countWords(p);
    
    // Handle massive paragraphs by splitting them
    if (wc > wordsBudget && acc.length === 0) {
      // If first paragraph is too large, truncate it to fit budget
      const truncatedText = truncateParagraphToWordLimit(p, wordsBudget);
      acc.push(truncatedText);
      totalWords = countWords(truncatedText);
      idx = (idx + 1) % paragraphs.length;
      break;
    }
    
    // Only add if it fits within budget
    if (totalWords + wc <= wordsBudget) {
      acc.push(p); 
      totalWords += wc; 
      idx = (idx + 1) % paragraphs.length;
      // Break if we've reached the budget
      if (totalWords >= wordsBudget) break;
    } else {
      break;
    }
  }
  
  return { 
    chunk: acc.join(' '), 
    nextPointer: idx, 
    words: totalWords 
  };
}

/**
 * Truncate paragraph to fit within word limit
 * @param {string} paragraph - Paragraph text
 * @param {number} maxWords - Maximum words allowed
 * @returns {string} Truncated paragraph
 */
function truncateParagraphToWordLimit(paragraph, maxWords) {
  const words = paragraph.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return paragraph;
  }
  
  const truncatedWords = words.slice(0, maxWords);
  return truncatedWords.join(' ') + '...';
}

/**
 * Calculate reading time for a given word count and WPM
 * @param {number} words - Number of words
 * @param {number} wpm - Words per minute
 * @returns {number} Reading time in seconds
 */
export function calculateReadingTime(words, wpm) {
  return Math.ceil((words * 60) / Math.max(1, wpm));
}

/**
 * Calculate interval between words for RSVP
 * @param {number} wpm - Words per minute
 * @returns {number} Interval in milliseconds
 */
export function calculateWordInterval(wpm) {
  return Math.max(40, Math.round(60000 / Math.max(1, wpm)));
}

/**
 * Split text into words for RSVP display
 * @param {string} text - Text to split
 * @returns {Array} Array of words
 */
export function splitTextIntoWords(text) {
  return (text || '').split(/\s+/).filter(Boolean);
}

/**
 * Validate WPM value
 * @param {number} wpm - Words per minute value
 * @returns {number} Clamped WPM value
 */
export function validateWPM(wpm) {
  return Math.max(60, Math.min(1200, wpm));
}

/**
 * Calculate reading progress
 * @param {number} currentPointer - Current position
 * @param {number} totalParagraphs - Total paragraphs
 * @returns {Object} Progress information
 */
export function calculateReadingProgress(currentPointer, totalParagraphs) {
  return {
    current: currentPointer + 1,
    total: totalParagraphs,
    percentage: Math.round(((currentPointer + 1) / totalParagraphs) * 100)
  };
}
