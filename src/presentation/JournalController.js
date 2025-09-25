/**
 * Presentation layer for Journal UI
 * Handles journal interface and user interactions
 */

import { saveJournalEntry, loadJournalEntries, getCurrentIntentText, saveCurrentIntentText, clearCurrentIntentText } from '../application/JournalService.js';
import { getElementById, updateTextContent, updateInnerHTML, addClass, removeClass, addEventListener } from '../infrastructure/UI.js';
import { playSuccessBeep } from '../infrastructure/Audio.js';

/**
 * Initialize journal functionality
 * @param {string} from - Source URL parameter
 */
export function initializeJournal(from) {
  setupContextDisplay(from);
  setupIntentHandling();
  setupJournalDisplay();
}

/**
 * Setup context display showing where user came from
 * @param {string} from - Source URL parameter
 */
function setupContextDisplay(from) {
  const context = getElementById('context');
  if (!context) return;
  
  // Use 'from' parameter first, fall back to document.referrer
  let referrerUrl = from || document.referrer;
  
  if (referrerUrl && referrerUrl.trim()) {
    try {
      const u = new URL(referrerUrl);
      updateTextContent(context, `You came from: ${u.hostname}${u.pathname}`);
    } catch (e) {
      // If URL parsing fails, try to extract domain from the string
      const domainMatch = referrerUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
      if (domainMatch) {
        updateTextContent(context, `You came from: ${domainMatch[1]}`);
      } else {
        updateTextContent(context, 'You came from a blocked page.');
      }
    }
  } else {
    updateTextContent(context, 'You came from a blocked page.');
  }
}

/**
 * Setup intent textarea handling
 */
function setupIntentHandling() {
  const intent = getElementById('intent');
  if (!intent) return;
  
  // Load saved intent
  const saved = getCurrentIntentText();
  if (saved) {
    intent.value = saved;
  }
  
  // Setup save button
  const saveBtn = getElementById('saveIntent');
  if (saveBtn) {
    addEventListener(saveBtn, 'click', handleSaveIntent);
  }
  
  // Setup clear button
  const clearBtn = getElementById('clearIntent');
  if (clearBtn) {
    addEventListener(clearBtn, 'click', handleClearIntent);
  }
}

/**
 * Handle save intent button click
 */
async function handleSaveIntent() {
  const intent = getElementById('intent');
  const text = (intent?.value || '').trim();
  
  // Save intent to localStorage first (original behavior)
  saveCurrentIntentText(text);
  
  if (text) {
    // Get source URL from context
    const from = new URLSearchParams(location.search).get('from') || document.referrer;
    
    // Save to journal
    const success = await saveJournalEntry(text, from);
    if (success) {
      // Render updated journal
      renderJournalEntries();
      highlightNewEntry();
      
      // Play success sound
      playSuccessBeep();
    }
  }
  
  // Remove saved indicator
  const savedEl = getElementById('intentSaved');
  if (savedEl) {
    savedEl.style.display = 'none';
  }
  
  // Clear and blur textarea
  intent.value = '';
  // Ensure nothing persists on reload (original behavior)
  clearCurrentIntentText();
  intent.blur();
}

/**
 * Handle clear intent button click
 */
function handleClearIntent() {
  const intent = getElementById('intent');
  if (intent) {
    intent.value = '';
  }
  
  clearCurrentIntentText();
  
  const savedEl = getElementById('intentSaved');
  if (savedEl) {
    savedEl.style.display = 'none';
  }
}

/**
 * Setup journal display
 */
function setupJournalDisplay() {
  renderJournalEntries();
}

/**
 * Render journal entries
 */
function renderJournalEntries() {
  const box = getElementById('journalEntries');
  if (!box) return;
  
  const entries = loadJournalEntries();
  
  if (!entries.length) {
    updateTextContent(box, 'No entries yet.');
    return;
  }
  
  const html = entries.map(entry => 
    `<div class="entry" data-index="${entries.indexOf(entry)}">
      <small>${entry.displayTime}${entry.displayFrom}</small><br>${entry.displayText}
    </div>`
  ).join('');
  
  updateInnerHTML(box, html);
}

/**
 * Highlight newly added entry
 */
function highlightNewEntry() {
  const box = getElementById('journalEntries');
  if (!box) return;
  
  const firstEntry = box.querySelector('.entry');
  if (firstEntry) {
    addClass(firstEntry, 'added');
    setTimeout(() => {
      removeClass(firstEntry, 'added');
    }, 1000);
  }
}

/**
 * Get journal entries for list mode
 * @returns {Array} Array of entry elements
 */
export function getJournalEntryElements() {
  const box = getElementById('journalEntries');
  if (!box) return [];
  
  return Array.from(box.querySelectorAll('.entry'));
}

/**
 * Clear journal entries
 * @returns {boolean} Success status
 */
export function clearJournalEntries() {
  const box = getElementById('journalEntries');
  if (box) {
    updateTextContent(box, 'No entries yet.');
  }
  return true;
}
