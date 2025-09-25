/**
 * Domain layer for Journal functionality
 * Pure business logic for journal entries
 */

/**
 * Create a journal entry object
 * @param {string} text - The journal entry text
 * @param {string} from - The source URL where the entry was created
 * @param {string} timestamp - ISO timestamp string
 * @returns {Object} Journal entry object
 */
export function createJournalEntry(text, from, timestamp = new Date().toISOString()) {
  return {
    text: text || '',
    from: from || '',
    at: timestamp
  };
}

/**
 * Validate a journal entry object
 * @param {Object} entry - Journal entry to validate
 * @returns {boolean} True if valid
 */
export function validateJournalEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (typeof entry.text !== 'string') return false;
  if (typeof entry.from !== 'string') return false;
  if (typeof entry.at !== 'string') return false;
  return true;
}

/**
 * Sort journal entries by timestamp (newest first)
 * @param {Array} entries - Array of journal entries
 * @returns {Array} Sorted entries
 */
export function sortJournalEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return [...entries].sort((a, b) => new Date(b.at) - new Date(a.at));
}

/**
 * Format journal entry for display
 * @param {Object} entry - Journal entry
 * @returns {Object} Formatted entry with display properties
 */
export function formatJournalEntry(entry) {
  if (!validateJournalEntry(entry)) return null;
  
  const date = new Date(entry.at);
  const when = date.toLocaleString();
  const fromTxt = entry.from ? (() => {
    try {
      const u = new URL(entry.from);
      return ` • from ${u.hostname}`;
    } catch {
      return '';
    }
  })() : '';
  
  return {
    ...entry,
    displayTime: when,
    displayFrom: fromTxt,
    displayText: entry.text.replace(/</g, '&lt;')
  };
}
