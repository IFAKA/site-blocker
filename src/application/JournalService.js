/**
 * Application layer for Journal operations
 * Business logic for journal management
 */

import { createJournalEntry, validateJournalEntry, sortJournalEntries, formatJournalEntry } from '../domain/Journal.js';
import { getJournalEntries, saveJournalEntries, addJournalEntry, getCurrentIntent, saveCurrentIntent, clearCurrentIntent } from '../infrastructure/Storage.js';

/**
 * Save a journal entry
 * @param {string} text - Journal entry text
 * @param {string} from - Source URL
 * @returns {Promise<boolean>} Success status
 */
export async function saveJournalEntry(text, from) {
  if (!text || !text.trim()) return false;
  
  const entry = createJournalEntry(text.trim(), from);
  if (!validateJournalEntry(entry)) return false;
  
  return addJournalEntry(entry);
}

/**
 * Load all journal entries
 * @returns {Array} Array of formatted journal entries
 */
export function loadJournalEntries() {
  const entries = getJournalEntries();
  return sortJournalEntries(entries).map(formatJournalEntry).filter(Boolean);
}

/**
 * Clear all journal entries
 * @returns {boolean} Success status
 */
export function clearJournalEntries() {
  return saveJournalEntries([]);
}

/**
 * Get journal entry count
 * @returns {number} Number of entries
 */
export function getJournalEntryCount() {
  const entries = getJournalEntries();
  return entries.length;
}

/**
 * Get current intent text
 * @returns {string} Current intent
 */
export function getCurrentIntentText() {
  return getCurrentIntent();
}

/**
 * Save current intent text
 * @param {string} intent - Intent text
 * @returns {boolean} Success status
 */
export function saveCurrentIntentText(intent) {
  return saveCurrentIntent(intent || '');
}

/**
 * Clear current intent text
 * @returns {boolean} Success status
 */
export function clearCurrentIntentText() {
  return clearCurrentIntent();
}

/**
 * Get journal entries for display
 * @returns {Array} Array of display-ready entries
 */
export function getJournalEntriesForDisplay() {
  const entries = loadJournalEntries();
  return entries.map(entry => ({
    ...entry,
    displayHTML: `<small>${entry.displayTime}${entry.displayFrom}</small><br>${entry.displayText}`
  }));
}

/**
 * Search journal entries
 * @param {string} query - Search query
 * @returns {Array} Matching entries
 */
export function searchJournalEntries(query) {
  if (!query || !query.trim()) return loadJournalEntries();
  
  const entries = loadJournalEntries();
  const searchTerm = query.toLowerCase();
  
  return entries.filter(entry => 
    entry.text.toLowerCase().includes(searchTerm) ||
    entry.from.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get journal statistics
 * @returns {Object} Journal statistics
 */
export function getJournalStatistics() {
  const entries = getJournalEntries();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.at);
    return entryDate >= today;
  });
  
  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.at);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entryDate >= weekAgo;
  });
  
  return {
    total: entries.length,
    today: todayEntries.length,
    thisWeek: thisWeekEntries.length,
    lastEntry: entries.length > 0 ? entries[0].at : null
  };
}
