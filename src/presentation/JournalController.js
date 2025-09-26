/**
 * Presentation layer for Journal UI
 * Handles journal interface and user interactions
 */

import { saveJournalEntry, loadJournalEntries, deleteJournalEntry, getCurrentIntentText, saveCurrentIntentText, clearCurrentIntentText } from '../application/JournalService.js';
import { getElementById, updateTextContent, updateInnerHTML, addClass, removeClass, addEventListener, createElement, removeEventListener } from '../infrastructure/UI.js';
import { playSuccessBeep } from '../infrastructure/Audio.js';

/**
 * Initialize journal functionality
 * @param {string} from - Source URL parameter
 */
export function initializeJournal(from) {
  setupContextDisplay(from);
  setupIntentHandling();
  setupJournalDisplay();
  setupJournalKeyHandling();
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
  
  // Add keyboard event listener for Cmd+Enter to save intent
  addEventListener(intent, 'keydown', handleIntentKeydown);
}

/**
 * Handle intent textarea keydown events
 * @param {KeyboardEvent} ev - Keyboard event
 */
function handleIntentKeydown(ev) {
  if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
    ev.preventDefault();
    handleSaveIntent();
  } else if (ev.key === 'x' && !ev.metaKey && !ev.ctrlKey && !ev.altKey) {
    ev.preventDefault();
    handleClearIntent();
  }
}

/**
 * Handle intent saving
 */
function handleSaveIntent() {
  const intent = getElementById('intent');
  if (!intent) return;
  
  const text = (intent.value || '').trim();
  
  if (text) {
    // Save to journal entry
    saveJournalEntry(text);
    
    // Save current intent text
    saveCurrentIntentText(text);
    
    // Show saved feedback
    const savedEl = getElementById('intentSaved');
    if (savedEl) {
      savedEl.style.display = 'block';
      setTimeout(() => {
        savedEl.style.display = 'none';
      }, 2000);
    }
    
    // Clear and blur textarea
    intent.value = '';
    clearCurrentIntentText();
    intent.blur();
    
    // Play success sound
    playSuccessBeep();
    
    // Refresh journal display
    renderJournalEntries();
    highlightNewEntry();
  }
}

/**
 * Handle intent clearing
 */
function handleClearIntent() {
  const intent = getElementById('intent');
  if (!intent) return;
  
  // Clear textarea
  intent.value = '';
  clearCurrentIntentText();
  
  // Hide saved feedback
  const savedEl = getElementById('intentSaved');
  if (savedEl) {
    savedEl.style.display = 'none';
  }
  
  // Focus back to textarea
  intent.focus();
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
    `<div class="entry" data-at="${entry.at}">
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

// --- Journal deletion with confirmation ---
let selectedJournalAt = '';
let journalKeydownHandler = null;
let isJournalHovered = false;

function setupJournalKeyHandling() {
  const box = getElementById('journalEntries');
  if (!box) return;

  // Click to select an entry
  addEventListener(box, 'click', (e) => {
    const entryEl = e.target.closest('.entry');
    if (!entryEl) return;
    selectJournalEntry(entryEl);
  });

  // Track hover state to scope shortcut
  addEventListener(box, 'mouseenter', () => { isJournalHovered = true; });
  addEventListener(box, 'mouseleave', () => { isJournalHovered = false; });

  // Auto-select entry on hover so 'd' works without click
  addEventListener(box, 'mousemove', (e) => {
    const entryEl = e.target && e.target.closest ? e.target.closest('.entry') : null;
    if (!entryEl) return;
    // Only update selection if hovered a different entry
    const at = entryEl.getAttribute('data-at') || '';
    if (at && at !== selectedJournalAt) {
      selectJournalEntry(entryEl);
    }
  });

  // Keydown handler to capture 'd' for delete when a journal entry is selected
  journalKeydownHandler = (ev) => {
    const key = (ev.key || '').toLowerCase();
    // Only act if journal area is active: hovered or focus within
    const activeEl = document.activeElement;
    const boxEl = getElementById('journalEntries');
    const focusWithin = !!(boxEl && activeEl && boxEl.contains(activeEl));
    if (!isJournalHovered && !focusWithin) return;
    if (!selectedJournalAt) return;

    // If a journal is selected and user presses 'd', open confirm
    if (key === 'd' && !ev.metaKey && !ev.ctrlKey && !ev.altKey) {
      // Prevent the global 'd' (doodle) shortcut
      ev.preventDefault();
      ev.stopPropagation();
      showJournalDeleteConfirm(selectedJournalAt);
      return;
    }
  };
  addEventListener(document, 'keydown', journalKeydownHandler, { capture: true });
}

function selectJournalEntry(entryEl) {
  const box = getElementById('journalEntries');
  if (!box || !entryEl) return;
  // Clear previous selection
  Array.from(box.querySelectorAll('.entry.selected')).forEach(el => el.classList.remove('selected'));
  entryEl.classList.add('selected');
  selectedJournalAt = entryEl.getAttribute('data-at') || '';
}

function showJournalDeleteConfirm(at) {
  if (!at) return;
  // Avoid multiple
  if (document.getElementById('journalConfirmModal')) return;

  const overlay = createElement('div', {
    id: 'journalConfirmModal',
    style: {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '10001'
    }
  });
  const box = createElement('div', { style: { background: '#0b1220', border: '1px solid #334155', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#e5e7eb', maxWidth: '320px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' } });
  box.innerHTML = `
    <div style="margin-bottom: 16px; font-weight: 600;">Delete this journal entry?</div>
    <div style="margin-bottom: 16px; font-size: 0.9rem; color: #94a3b8;">Press Y to confirm, N to cancel</div>
    <div style="display: flex; gap: 8px; justify-content: center;">
      <button id="journalConfirmNo" style="background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">No</button>
      <button id="journalConfirmYes" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Yes</button>
    </div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const cleanup = () => {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    removeEventListener(document, 'keydown', keyHandler, { capture: true });
  };

  const confirm = () => {
    deleteJournalEntry(at);
    // Rerender and clear selection
    renderJournalEntries();
    selectedJournalAt = '';
    cleanup();
  };

  const keyHandler = (e) => {
    const k = (e.key || '').toLowerCase();
    if (k === 'y') { e.preventDefault(); e.stopPropagation(); confirm(); }
    else if (k === 'n' || k === 'q' || k === 'escape') { e.preventDefault(); e.stopPropagation(); cleanup(); }
  };
  addEventListener(document, 'keydown', keyHandler, { capture: true });
  addEventListener(box.querySelector('#journalConfirmYes'), 'click', confirm);
  addEventListener(box.querySelector('#journalConfirmNo'), 'click', cleanup);
  addEventListener(overlay, 'click', (e) => { if (e.target === overlay) cleanup(); });
}
