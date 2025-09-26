/**
 * Infrastructure layer for Storage operations
 * Handles localStorage and other storage concerns
 */

import { STORAGE_KEYS } from '../shared/Constants.js';

/**
 * Set an item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export function setItem(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn('Failed to set localStorage item:', key, error);
    return false;
  }
}

/**
 * Get an item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Retrieved value or default
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn('Failed to get localStorage item:', key, error);
    return defaultValue;
  }
}

/**
 * Remove an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove localStorage item:', key, error);
    return false;
  }
}

/**
 * Clear all localStorage
 * @returns {boolean} Success status
 */
export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Get journal entries from storage
 * @returns {Array} Array of journal entries
 */
export function getJournalEntries() {
  return getItem(STORAGE_KEYS.JOURNAL, []);
}

/**
 * Save journal entries to storage
 * @param {Array} entries - Journal entries to save
 * @returns {boolean} Success status
 */
export function saveJournalEntries(entries) {
  return setItem(STORAGE_KEYS.JOURNAL, entries);
}

/**
 * Add a journal entry
 * @param {Object} entry - Journal entry to add
 * @returns {boolean} Success status
 */
export function addJournalEntry(entry) {
  const entries = getJournalEntries();
  entries.unshift(entry);
  // Limit to prevent storage bloat
  const limited = entries.slice(0, 200);
  return saveJournalEntries(limited);
}

/**
 * Delete a journal entry by its timestamp key
 * @param {string} at - ISO timestamp identifying the entry
 * @returns {boolean} Success status
 */
export function deleteJournalEntryByAt(at) {
  if (!at) return false;
  const entries = getJournalEntries();
  const filtered = Array.isArray(entries) ? entries.filter(e => e && e.at !== at) : [];
  return saveJournalEntries(filtered);
}

/**
 * Get current intent from storage
 * @returns {string} Current intent text
 */
export function getCurrentIntent() {
  return getItem(STORAGE_KEYS.INTENT, '');
}

/**
 * Save current intent to storage
 * @param {string} intent - Intent text
 * @returns {boolean} Success status
 */
export function saveCurrentIntent(intent) {
  return setItem(STORAGE_KEYS.INTENT, intent);
}

/**
 * Clear current intent from storage
 * @returns {boolean} Success status
 */
export function clearCurrentIntent() {
  return removeItem(STORAGE_KEYS.INTENT);
}

/**
 * Get exercise routine index
 * @returns {number} Current exercise index
 */
export function getExerciseIndex() {
  const value = getItem(STORAGE_KEYS.ROUTINE_INDEX, '0');
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * Set exercise routine index
 * @param {number} index - Exercise index
 * @returns {boolean} Success status
 */
export function setExerciseIndex(index) {
  return setItem(STORAGE_KEYS.ROUTINE_INDEX, String(index));
}

/**
 * Get reading pointer
 * @returns {number} Current reading pointer
 */
export function getReadingPointer() {
  const value = getItem(STORAGE_KEYS.READER_POINTER, '0');
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * Set reading pointer
 * @param {number} pointer - Reading pointer
 * @returns {boolean} Success status
 */
export function setReadingPointer(pointer) {
  return setItem(STORAGE_KEYS.READER_POINTER, String(Math.max(0, pointer)));
}

/**
 * Get reading WPM setting
 * @returns {number} Words per minute
 */
export function getReadingWPM() {
  const value = getItem(STORAGE_KEYS.READER_WPM, '250');
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 250 : Math.max(60, Math.min(1200, parsed));
}

/**
 * Set reading WPM setting
 * @param {number} wpm - Words per minute
 * @returns {boolean} Success status
 */
export function setReadingWPM(wpm) {
  const clamped = Math.max(60, Math.min(1200, wpm));
  return setItem(STORAGE_KEYS.READER_WPM, String(clamped));
}

/**
 * Get book metadata
 * @returns {number} Book length
 */
export function getBookMeta() {
  return getItem(STORAGE_KEYS.BOOK_META, '0');
}

/**
 * Set book metadata
 * @param {number} length - Book length
 * @returns {boolean} Success status
 */
export function setBookMeta(length) {
  return setItem(STORAGE_KEYS.BOOK_META, String(length));
}

/**
 * Get Chinese learning progress
 * @returns {Object} Chinese progress data
 */
export function getChineseProgress() {
  return getItem(STORAGE_KEYS.CHINESE_PROGRESS, {});
}

/**
 * Set Chinese learning progress
 * @param {Object} progress - Progress data
 * @returns {boolean} Success status
 */
export function setChineseProgress(progress) {
  return setItem(STORAGE_KEYS.CHINESE_PROGRESS, progress);
}
