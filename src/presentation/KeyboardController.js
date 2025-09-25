/**
 * Presentation layer for Keyboard shortcuts
 * Handles global keyboard shortcuts and navigation
 */

import { getElementById, addEventListener, focusElement, blurElement, querySelector, querySelectorAll, scrollIntoView } from '../infrastructure/UI.js';
import { KEYBOARD_SHORTCUTS } from '../shared/Constants.js';

/**
 * Initialize keyboard shortcuts
 */
export function initializeKeyboardShortcuts() {
  setupGlobalShortcuts();
  setupListModeShortcuts();
}

// List mode state
let listMode = false;
let selected = -1;

/**
 * Get journal entries for list mode
 * @returns {Array} Array of entry elements
 */
function getEntries() {
  return Array.from(querySelectorAll('.entry') || []);
}

/**
 * Clear selection highlighting
 */
function clearSelection() {
  getEntries().forEach(el => el.classList.remove('selected'));
}

/**
 * Ensure selected element is visible
 * @param {HTMLElement} el - Element to make visible
 */
function ensureVisible(el) {
  if (!el) return;
  const journalBox = getElementById('journalBox');
  if (!journalBox) return;
  
  const pr = journalBox.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  
  if (er.top < pr.top) {
    el.scrollIntoView({ block: 'nearest' });
  } else if (er.bottom > pr.bottom) {
    el.scrollIntoView({ block: 'nearest' });
  }
}

/**
 * Enter list mode
 */
function enterListMode() {
  const items = getEntries();
  if (!items.length) return;
  
  listMode = true;
  selected = 0;
  clearSelection();
  items[selected].classList.add('selected');
  ensureVisible(items[selected]);
}

/**
 * Exit list mode
 */
function exitListMode() {
  listMode = false;
  selected = -1;
  clearSelection();
}

/**
 * Move selection
 * @param {number} delta - Movement delta
 */
function moveSelection(delta) {
  const items = getEntries();
  if (!items.length) return;
  
  selected = Math.max(0, Math.min(items.length - 1, selected + delta));
  clearSelection();
  items[selected].classList.add('selected');
  ensureVisible(items[selected]);
}

/**
 * Show overlay message
 * @param {string} text - Message text
 */
function showOverlay(text) {
  const overlay = getElementById('overlay');
  if (!overlay) return;
  
  const overlayMsg = getElementById('overlayMsg');
  if (overlayMsg) {
    overlayMsg.textContent = text;
  }
  
  overlay.classList.add('show');
  setTimeout(() => {
    overlay.classList.remove('show');
  }, 900);
}

/**
 * Copy selected entry
 */
async function copySelected() {
  const items = getEntries();
  if (!items.length || selected < 0) return;
  
  const node = items[selected];
  const html = node.innerHTML;
  const parts = html.split('<br>');
  const textHtml = parts.slice(1).join('<br>');
  const tmp = document.createElement('div');
  tmp.innerHTML = textHtml;
  const text = tmp.textContent || '';
  
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
  
  node.classList.add('copied');
  setTimeout(() => {
    node.classList.remove('copied');
  }, 700);
  
  showOverlay('Copied to clipboard');
  exitListMode();
}

/**
 * Check if element is typing context
 * @param {HTMLElement} el - Element to check
 * @returns {boolean} True if typing context
 */
function isTypingContext(el) {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (el.isContentEditable) return true;
  const ce = el.closest && el.closest('[contenteditable="true"]');
  if (ce) return true;
  return false;
}

/**
 * Handle global keydown events
 * @param {KeyboardEvent} ev - Keyboard event
 */
function handleGlobalKeydown(ev) {
  const key = ev.key.toLowerCase();
  
  // If any modal is open, only allow q to close
  const anyModalOpen = !!querySelector('.modal.show');
  if (anyModalOpen) {
    if (key === 'q') {
      ev.preventDefault();
      // Close any open modal
      const openModal = querySelector('.modal.show');
      if (openModal) {
        openModal.classList.remove('show');
      }
    }
    return;
  }
  
  const active = document.activeElement;
  
  // If typing: handle Escape to blur and Cmd+Enter to submit, otherwise pass through
  if (isTypingContext(active)) {
    if (key === 'escape') {
      ev.preventDefault();
      if (active && active.blur) {
        active.blur();
      }
      return;
    }
    if (key === 'enter' && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault();
      const saveBtn = getElementById('saveIntent');
      if (saveBtn) {
        saveBtn.click();
      }
      return;
    }
    return;
  }
  
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  
  if (listMode) {
    if (key === 'j') { ev.preventDefault(); moveSelection(1); return; }
    if (key === 'k') { ev.preventDefault(); moveSelection(-1); return; }
    if (key === 'c') { ev.preventDefault(); copySelected(); return; }
    if (key === 'escape') { ev.preventDefault(); exitListMode(); return; }
  }
  if (key === 'p') { ev.preventDefault(); const prayBtn = getElementById('prayBtn'); if (prayBtn) prayBtn.click(); return; }
  if (key === 'r') { ev.preventDefault(); const readBtn = getElementById('readBtn'); if (readBtn) readBtn.click(); return; }
  if (key === 's') { ev.preventDefault(); const exStart = getElementById('exStart'); if (exStart) exStart.click(); return; }
  if (key === 'j') { ev.preventDefault(); const intent = getElementById('intent'); if (intent) focusElement(intent); return; }
  if (key === 'l') { ev.preventDefault(); enterListMode(); return; }
  if (key === 'd') { ev.preventDefault(); if (window.showDoodleModal) window.showDoodleModal(); return; }
  if (key === 'e') { ev.preventDefault(); if (window.showEyeHealthModal) window.showEyeHealthModal(); return; }
  
  // Intent shortcuts
  if (key === 'enter') { ev.preventDefault(); const saveBtn = getElementById('saveIntent'); if (saveBtn) saveBtn.click(); return; }
  if (key === 'x') { ev.preventDefault(); const clearBtn = getElementById('clearIntent'); if (clearBtn) clearBtn.click(); return; }
  
  // Exercise shortcuts
  if (key === 'n') { ev.preventDefault(); const exSkip = getElementById('exSkip'); if (exSkip) exSkip.click(); return; }
  if (key === 't') { ev.preventDefault(); const exReset = getElementById('exReset'); if (exReset) exReset.click(); return; }
}

/**
 * Setup global keyboard shortcuts
 */
function setupGlobalShortcuts() {
  addEventListener(document, 'keydown', handleGlobalKeydown);
}

/**
 * Setup list mode shortcuts
 */
function setupListModeShortcuts() {
  // List mode functionality is now handled by the global keydown handler
  // No additional setup needed as all functions are at module level
}
