/**
 * Presentation layer for Keyboard shortcuts
 * Handles global keyboard shortcuts and navigation
 */

import { getElementById, addEventListener, focusElement, blurElement, querySelector, querySelectorAll, scrollIntoView } from '../infrastructure/UI.js';
import { KEYBOARD_SHORTCUTS } from '../shared/Constants.js';
import { deleteJournalEntry } from '../application/JournalService.js';
import { clearJournalEntries as clearJournalEntriesUI } from './JournalController.js';
import { handleMirrorKeydown } from './MirrorController.js';
import { hideShortcutsModal, showShortcutsModal } from './ShortcutsController.js';
import { handleModalKeydown, getShortcutsContext } from './ModalManager.js';

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

// Smooth scroll state
let activeScrollAnimation = null;
let activeScrollTarget = null;

// Scroll tuning
const SCROLL_STEP_PX = 60;
const SCROLL_FAST_MULTIPLIER = 3;

function cancelActiveScroll() {
  if (activeScrollAnimation !== null) {
    cancelAnimationFrame(activeScrollAnimation);
    activeScrollAnimation = null;
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function getPrimaryScrollContainer() {
  // Prefer the document's scrolling element (html/body depending on browser)
  return document.scrollingElement || document.documentElement || document.body;
}

function smoothScrollByPixels(deltaY, duration = 200) {
  try {
    cancelActiveScroll();
    const container = getPrimaryScrollContainer();
    activeScrollTarget = container;
    const viewport = window.innerHeight || container.clientHeight;
    const maxScroll = Math.max(0, (container.scrollHeight || document.documentElement.scrollHeight) - viewport);
    const startY = container.scrollTop || (window.scrollY || 0);
    const targetY = Math.max(0, Math.min(maxScroll, startY + deltaY));
    if (targetY === startY) return;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const current = startY + (targetY - startY) * eased;
      if (activeScrollTarget === container) {
        container.scrollTop = current;
      } else {
        // Target changed, stop this animation
        activeScrollAnimation = null;
        return;
      }
      if (t < 1) {
        activeScrollAnimation = requestAnimationFrame(step);
      } else {
        activeScrollAnimation = null;
      }
    };
    activeScrollAnimation = requestAnimationFrame(step);
  } catch {}
}

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

function getSelectedAt() {
  const items = getEntries();
  if (!items.length || selected < 0 || selected >= items.length) return '';
  const node = items[selected];
  return node.getAttribute('data-at') || '';
}

function showJournalDeleteConfirmListMode(onConfirm) {
  if (document.getElementById('journalConfirmModal')) return;
  const overlay = document.createElement('div');
  overlay.id = 'journalConfirmModal';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.7)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '10001';

  const box = document.createElement('div');
  box.style.background = '#0b1220';
  box.style.border = '1px solid #334155';
  box.style.borderRadius = '12px';
  box.style.padding = '20px';
  box.style.textAlign = 'center';
  box.style.color = '#e5e7eb';
  box.style.maxWidth = '320px';
  box.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
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
    document.removeEventListener('keydown', keyHandler, true);
  };

  const confirm = () => { cleanup(); onConfirm && onConfirm(); };
  const keyHandler = (e) => {
    const k = (e.key || '').toLowerCase();
    if (k === 'y') { e.preventDefault(); e.stopPropagation(); confirm(); }
    else if (k === 'n' || k === 'q' || k === 'escape') { e.preventDefault(); e.stopPropagation(); cleanup(); }
  };
  document.addEventListener('keydown', keyHandler, true);
  box.querySelector('#journalConfirmYes')?.addEventListener('click', confirm);
  box.querySelector('#journalConfirmNo')?.addEventListener('click', cleanup);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(); });
}

function deleteSelectedInListMode() {
  const items = getEntries();
  if (!items.length || selected < 0) return;
  const at = getSelectedAt();
  if (!at) return;

  showJournalDeleteConfirmListMode(() => {
    deleteJournalEntry(at);
    // Update DOM list
    const node = items[selected];
    const parent = node && node.parentNode;
    if (parent) parent.removeChild(node);
    const remaining = getEntries();
    if (!remaining.length) {
      // Show empty state message
      try { clearJournalEntriesUI(); } catch {}
      exitListMode();
      return;
    }
    // Keep selection index valid and re-highlight
    selected = Math.min(selected, remaining.length - 1);
    clearSelection();
    remaining[selected].classList.add('selected');
    ensureVisible(remaining[selected]);
  });
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
  
  // Handle modal keyboard events first
  if (handleModalKeydown(ev)) {
    return; // Modal manager handled the event
  }
  
  // Check if any modal is open and let modal-specific handlers process other keys
  const anyModalOpen = !!querySelector('.modal.show');
  if (anyModalOpen) {
    const openModals = querySelectorAll('.modal.show');
    if (openModals.length > 0) {
      const topModal = openModals[openModals.length - 1];
      
      // Let mirror modal handle its own keys
      if (topModal.id === 'mirrorModal') {
        if (handleMirrorKeydown(ev)) {
          return; // Mirror handler processed the event
        }
      }
      
      // Let Chinese modal handle its own keys
      if (topModal.id === 'chineseModal') {
        // Chinese modal handles its own keys in handleChineseModalKeydown
        return;
      }
      
      // For other modals, let their specific handlers process keys
      return;
    }
  }
  
  const active = document.activeElement;
  
  // If typing: handle Escape to blur and Enter to submit, otherwise pass through
  if (isTypingContext(active)) {
    if (key === 'escape' || ev.key === 'Escape') {
      ev.preventDefault();
      if (active && active.blur) {
        active.blur();
      }
      return;
    }
    if (key === 'enter') {
      // Handle textarea specially - allow line breaks and Cmd+Enter for submission
      if (active.tagName === 'TEXTAREA') {
        // Allow Shift+Enter for line breaks (default behavior)
        if (ev.shiftKey) {
          return; // Let default behavior happen (new line)
        }
        // Cmd+Enter or Ctrl+Enter for submission
        if (ev.metaKey || ev.ctrlKey) {
          ev.preventDefault();
          // Handle intent textarea specially
          if (active.id === 'intent') {
            // Let the JournalController handle this
            return;
          }
          // Try to find a submit button for other forms
          const form = active.closest('form');
          if (form) {
            const submitBtn = form.querySelector('button[type="submit"], .btn');
            if (submitBtn) {
              submitBtn.click();
            }
          }
          return;
        }
        // Regular Enter in textarea - allow default behavior (new line)
        return;
      }
      
      // For other input types, handle submission
      ev.preventDefault();
      // Handle different input contexts
      if (active.id === 'mindAnswer') {
        // Let the mind controller handle this - don't prevent default
        return;
      } else {
        // Generic submit - try to find a submit button
        const form = active.closest('form');
        if (form) {
          const submitBtn = form.querySelector('button[type="submit"], .btn');
          if (submitBtn) {
            submitBtn.click();
          }
        }
      }
      return;
    }
    // Block all other keybindings when typing
    return;
  }
  
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  
  // Handle ? key to open shortcuts modal based on context
  if (key === '?') {
    ev.preventDefault();
    const context = getShortcutsContext();
    showShortcutsModal(context);
    return;
  }
  
  if (listMode) {
    if (key === 'j') { ev.preventDefault(); moveSelection(1); return; }
    if (key === 'k') { ev.preventDefault(); moveSelection(-1); return; }
    if (key === 'c') { ev.preventDefault(); copySelected(); return; }
    if (key === 'd') { ev.preventDefault(); deleteSelectedInListMode(); return; }
    if (key === 'escape') { ev.preventDefault(); exitListMode(); return; }
  }
  if (key === 'p') { ev.preventDefault(); if (window.isPrayerActive && window.isPrayerActive()) { if (window.cancelPrayer) window.cancelPrayer(); } else { if (window.startPrayer) window.startPrayer(); } return; }
  if (key === 'r') { ev.preventDefault(); if (window.showReadingModal) window.showReadingModal(); return; }
  if (key === 's') { ev.preventDefault(); const exStart = getElementById('exStart'); if (exStart) exStart.click(); return; }
  if (key === 'w') { ev.preventDefault(); if (window.showExerciseModal) window.showExerciseModal(); return; }
  if (key === 'i') { ev.preventDefault(); const intent = getElementById('intent'); if (intent) focusElement(intent); return; }
  if (key === 'l') { ev.preventDefault(); enterListMode(); return; }
  if (key === 'd') { ev.preventDefault(); if (window.showDoodleModal) window.showDoodleModal(); return; }
  if (key === 'e') { ev.preventDefault(); if (window.showEyeHealthModal) window.showEyeHealthModal(); return; }
  if (key === 'm') { ev.preventDefault(); if (window.showMindModal) window.showMindModal(); return; }
  if (key === 'c') { ev.preventDefault(); if (window.showChineseModal) window.showChineseModal(); return; }
  if (key === 'v') { ev.preventDefault(); if (window.showMirrorModal) window.showMirrorModal(); return; }
  if (key === 'g') { ev.preventDefault(); if (window.focusGallery) window.focusGallery(); return; }

  // Global scrolling with j/k when not in list mode and not typing (Surfingkeys-like)
  if (key === 'j' || key === 'k') {
    ev.preventDefault();
    const multiplier = ev.shiftKey ? SCROLL_FAST_MULTIPLIER : 1;
    const delta = (key === 'j' ? 1 : -1) * SCROLL_STEP_PX * multiplier;
    smoothScrollByPixels(delta);
    return;
  }
  
  
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
