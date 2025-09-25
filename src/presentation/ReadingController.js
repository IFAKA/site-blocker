/**
 * Presentation layer for Reading UI
 * Handles reading interface and user interactions
 */

import { loadBookText, getCurrentReadingPointer, setCurrentReadingPointer, getCurrentReadingWPM, setCurrentReadingWPM, getCurrentReadingChunk, moveToNextReadingChunk, calculateReadingSessionTiming, splitTextForRSVP, getStoredBookText } from '../application/ReadingService.js';
import { normalizeTextToParagraphs } from '../domain/Reading.js';
import { getElementById, updateTextContent, showElement, hideElement, addEventListener, createElement, focusElement, addClass, removeClass } from '../infrastructure/UI.js';
import { playBeep, playReadingCompleteBeep } from '../infrastructure/Audio.js';
import { clamp } from '../shared/Utils.js';

/**
 * Initialize reading functionality
 */
export function initializeReading() {
  setupReadingModal();
  setupReadingControls();
}

/**
 * Setup reading modal
 */
function setupReadingModal() {
  const openBtn = getElementById('readBtn');
  const modal = getElementById('readModal');
  const closeBtn = getElementById('readClose');
  
  if (openBtn) {
    addEventListener(openBtn, 'click', showReadingModal);
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', hideReadingModal);
  }
  
  // Modal keydown handler attached to document (like original)
  addEventListener(document, 'keydown', handleModalKeydown);
}

/**
 * Setup reading controls
 */
function setupReadingControls() {
  const startBtn = getElementById('readStart');
  const wpmInput = getElementById('wpm');
  
  if (startBtn) {
    addEventListener(startBtn, 'click', handleToggleReading);
  }
  
  if (wpmInput) {
    addEventListener(wpmInput, 'change', handleWPMChange);
  }
}

/**
 * Show reading modal
 */
async function showReadingModal() {
  const modal = getElementById('readModal');
  if (!modal) return;
  
  addClass(modal, 'show');
  // Remove aria-hidden when modal is shown to allow focus
  modal.removeAttribute('aria-hidden');
  updateReadingInfo();
  
  const wpmInput = getElementById('wpm');
  if (wpmInput) {
    wpmInput.value = String(getCurrentReadingWPM());
  }
  
  const wordEl = getElementById('readWord');
  if (wordEl) {
    updateTextContent(wordEl, '—');
  }
  
  clearFullEl();
  hideParagraphView();
  
  // Update button state
  updateStartPauseButton();
  
  // Load book text and auto-start if available
  const statusEl = getElementById('readStatus');
  if (statusEl) {
    updateTextContent(statusEl, 'Loading text...');
  }
  
  await loadBookText(false);
  const text = getStoredBookText();
  if (text) {
    if (statusEl) {
      updateTextContent(statusEl, 'Ready to read');
    }
    startReading();
  } else {
    if (statusEl) {
      updateTextContent(statusEl, 'No text found. Ensure book.txt is bundled in the extension.');
    }
  }
}

/**
 * Hide reading modal
 */
function hideReadingModal() {
  const modal = getElementById('readModal');
  if (modal) {
    removeClass(modal, 'show');
    // Restore aria-hidden when modal is hidden
    modal.setAttribute('aria-hidden', 'true');
  }
  cancelReading();
}

// Reading state
let readingTimer = null;
let readingWords = [];
let readingPos = 0;
let readingRunning = false;
let readingChunkNextPtr = 0;
let readingCurrentChunkText = '';
let readingParaEl = null;
let readingCountdownTimer = null;
let readingCountdownSeconds = 0;


/**
 * Update reading info display
 */
function updateReadingInfo() {
  const infoEl = getElementById('readInfo');
  if (!infoEl) return;
  
  const text = getStoredBookText();
  const paras = normalizeTextToParagraphs(text);
  const pointer = getCurrentReadingPointer();
  
  let infoText = `${paras.length} paragraphs • pointer ${pointer + 1}/${Math.max(1, paras.length)}`;
  
  // Add countdown if there's time remaining (running or paused)
  if (readingCountdownSeconds > 0) {
    infoText += ` • ${readingCountdownSeconds}s`;
  }
  
  updateTextContent(infoEl, infoText);
}

/**
 * Update start/pause button text and state
 */
function updateStartPauseButton() {
  const startBtn = getElementById('readStart');
  if (!startBtn) return;
  
  if (readingRunning) {
    updateTextContent(startBtn, 'Pause');
    startBtn.classList.add('btn', 'secondary');
  } else {
    updateTextContent(startBtn, 'Resume');
    startBtn.classList.add('btn');
    startBtn.classList.remove('secondary');
  }
}


/**
 * Start reading session
 */
function startReading() {
  if (readingRunning) return;
  
  const text = getStoredBookText();
  if (!text) {
    const statusEl = getElementById('readStatus');
    if (statusEl) {
      updateTextContent(statusEl, 'No text found. Ensure book.txt is bundled in the extension.');
    }
    return;
  }
  
  const paras = normalizeTextToParagraphs(text);
  const pointer = getCurrentReadingPointer();
  const chunk = getCurrentReadingChunk();
  
  if (!chunk) return;
  
  readingCurrentChunkText = chunk.chunk;
  readingChunkNextPtr = chunk.nextPointer;
  readingWords = splitTextForRSVP(chunk.chunk);
  readingPos = 0;
  readingRunning = true;
  
  // Update button state
  updateStartPauseButton();
  
  // Calculate and start countdown
  const wpm = getCurrentReadingWPM();
  const totalTime = Math.ceil((readingWords.length / wpm) * 60);
  startCountdown(totalTime);
  
  stepReading();
}

/**
 * Pause reading session
 */
function pauseReading() {
  readingRunning = false;
  if (readingTimer) {
    clearInterval(readingTimer);
    readingTimer = null;
  }
  // Pause the countdown timer but keep the time visible
  if (readingCountdownTimer) {
    clearInterval(readingCountdownTimer);
    readingCountdownTimer = null;
  }
  
  // Update button state and info
  updateStartPauseButton();
  updateReadingInfo();
}

/**
 * Resume reading session
 */
function resumeReading() {
  if (readingRunning) return;
  
  readingRunning = true;
  
  // Update button state
  updateStartPauseButton();
  
  // Resume countdown for remaining words
  const remainingWords = readingWords.length - readingPos;
  if (remainingWords > 0) {
    const wpm = getCurrentReadingWPM();
    const remainingTime = Math.ceil((remainingWords / wpm) * 60);
    startCountdown(remainingTime);
  }
  
  stepReading();
}


/**
 * Cancel reading session
 */
function cancelReading() {
  if (readingTimer) {
    clearInterval(readingTimer);
    readingTimer = null;
  }
  readingRunning = false;
  stopCountdown();
  
  // Update button state
  updateStartPauseButton();
}

/**
 * Step through reading words
 */
function stepReading() {
  const wpm = getCurrentReadingWPM();
  const intervalMs = Math.max(40, Math.round(60000 / Math.max(1, wpm)));
  
  if (readingTimer) {
    clearInterval(readingTimer);
  }
  
  readingTimer = setInterval(() => {
    if (!readingRunning) return;
    
    if (readingPos >= readingWords.length) {
      clearInterval(readingTimer);
      readingTimer = null;
      readingRunning = false;
      setCurrentReadingPointer(readingChunkNextPtr);
      updateReadingInfo();
      stopCountdown();
      
      try {
        showParagraphView(readingCurrentChunkText);
      } catch {}
      
      playReadingCompleteBeep();
      return;
    }
    
    const current = readingWords[readingPos++];
    const wordEl = getElementById('readWord');
    if (wordEl) {
      updateTextContent(wordEl, current);
    }
  }, intervalMs);
}

/**
 * Start countdown timer
 * @param {number} totalSeconds - Total seconds
 */
function startCountdown(totalSeconds) {
  readingCountdownSeconds = totalSeconds;
  updateCountdownDisplay();
  
  if (readingCountdownTimer) {
    clearInterval(readingCountdownTimer);
  }
  
  readingCountdownTimer = setInterval(() => {
    readingCountdownSeconds--;
    updateCountdownDisplay();
    if (readingCountdownSeconds <= 0) {
      clearInterval(readingCountdownTimer);
      readingCountdownTimer = null;
    }
  }, 1000);
}

/**
 * Stop countdown timer
 */
function stopCountdown() {
  if (readingCountdownTimer) {
    clearInterval(readingCountdownTimer);
    readingCountdownTimer = null;
  }
  readingCountdownSeconds = 0;
  updateCountdownDisplay();
}

/**
 * Update countdown display
 */
function updateCountdownDisplay() {
  // Update the readInfo with countdown
  updateReadingInfo();
}

/**
 * Show paragraph view
 * @param {string} text - Text to display
 */
function showParagraphView(text) {
  const readerBox = getElementById('readWord')?.parentElement;
  const controlsEl = getElementById('readModal')?.querySelector('.controls');
  
  if (readerBox) hideElement(readerBox);
  if (controlsEl) hideElement(controlsEl);
  
  const el = ensureParagraphEl();
  if (!el) return;
  
  updateTextContent(el, text || '');
  showElement(el);
  
  try {
    focusElement(el);
  } catch {}
  
  selectionInit(text || '');
  attachParagraphPointerEvents();
  setCollapsedCaret(lastCaretIndex);
}

/**
 * Hide paragraph view
 */
function hideParagraphView() {
  const readerBox = getElementById('readWord')?.parentElement;
  const controlsEl = getElementById('readModal')?.querySelector('.controls');
  
  if (readerBox) showElement(readerBox);
  if (controlsEl) showElement(controlsEl);
  
  if (readingParaEl) {
    hideElement(readingParaEl);
  }
  
  clearNativeSelection();
}

/**
 * Ensure paragraph element exists
 * @returns {HTMLElement} Paragraph element
 */
function ensureParagraphEl() {
  if (readingParaEl && readingParaEl.isConnected) {
    return readingParaEl;
  }
  
  const panel = getElementById('readModal')?.querySelector('.panel');
  if (!panel) return null;
  
  const el = createElement('div', {
    id: 'readParagraph',
    tabindex: '0',
    contenteditable: 'true',
    style: {
      outline: 'none',
      width: '100%',
      maxHeight: '260px',
      overflow: 'auto',
      padding: '12px',
      borderRadius: '10px',
      background: '#0a1322',
      border: '1px solid #243242',
      whiteSpace: 'pre-wrap',
      marginTop: '8px'
    }
  });
  
  panel.appendChild(el);
  readingParaEl = el;
  return readingParaEl;
}

/**
 * Clear full element
 */
function clearFullEl() {
  const el = getElementById('readFull');
  if (el) {
    updateTextContent(el, '');
  }
}

// Paragraph selection state
let selText = '';
let selActive = false;
let selAnchor = 0;
let selFocus = 0;
let paraText = '';
let lastCaretIndex = 0;

/**
 * Initialize text selection
 * @param {string} text - Text content
 */
function selectionInit(text) {
  paraText = text || '';
  selActive = false;
  selAnchor = 0;
  selFocus = 0;
  selText = '';
  clearNativeSelection();
  lastCaretIndex = 0;
}

/**
 * Clear native selection
 */
function clearNativeSelection() {
  try {
    const s = window.getSelection();
    if (s) s.removeAllRanges();
  } catch {}
}

/**
 * Set collapsed caret position
 * @param {number} pos - Caret position
 */
function setCollapsedCaret(pos) {
  if (!readingParaEl || !readingParaEl.firstChild) return;
  
  const p = clamp(pos, 0, paraText.length);
  const r = document.createRange();
  r.setStart(readingParaEl.firstChild, p);
  r.collapse(true);
  
  const s = window.getSelection();
  if (!s) return;
  
  s.removeAllRanges();
  s.addRange(r);
  lastCaretIndex = p;
  selFocus = p;
}


/**
 * Attach paragraph pointer events
 */
function attachParagraphPointerEvents() {
  if (!readingParaEl) return;
  
  readingParaEl.onmousedown = (e) => {
    const off = getCaretOffsetFromPoint(e.clientX, e.clientY);
    if (off != null) lastCaretIndex = clamp(off, 0, paraText.length);
  };
  
  readingParaEl.onmouseup = (e) => {
    const off = getCaretOffsetFromPoint(e.clientX, e.clientY);
    if (off != null) lastCaretIndex = clamp(off, 0, paraText.length);
  };
  
  readingParaEl.onkeyup = () => {
    const r = getSelectionIfInsidePara();
    if (r) lastCaretIndex = clamp(r.endOffset, 0, paraText.length);
  };
}

/**
 * Get caret offset from point
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {number|null} Caret offset
 */
function getCaretOffsetFromPoint(x, y) {
  try {
    if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      if (range && range.startContainer && readingParaEl && readingParaEl.contains(range.startContainer)) {
        return range.startOffset;
      }
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos && pos.offsetNode && readingParaEl && readingParaEl.contains(pos.offsetNode)) {
        return pos.offset;
      }
    }
  } catch {}
  return null;
}

/**
 * Get selection if inside paragraph
 * @returns {Range|null} Selection range
 */
function getSelectionIfInsidePara() {
  try {
    const s = window.getSelection();
    if (!s || s.rangeCount === 0) return null;
    const r = s.getRangeAt(0);
    if (!readingParaEl) return null;
    if (!readingParaEl.contains(r.commonAncestorContainer)) return null;
    return r;
  } catch {
    return null;
  }
}

/**
 * Handle modal keydown events
 * @param {KeyboardEvent} ev - Keyboard event
 */
function handleModalKeydown(ev) {
  if (!getElementById('readModal')?.classList.contains('show')) return;
  
  const key = (ev.key || '').toLowerCase();
  
  // Always allow Escape or q to close
  if (key === 'escape' || key === 'q') {
    ev.preventDefault();
    hideReadingModal();
    return;
  }
  
  // If paragraph view is visible, enable keyboard selection UX
  if (readingParaEl && readingParaEl.isConnected && readingParaEl.style.display !== 'none') {
    if (handleParagraphKey(ev, key)) return;
  }
  
  // If typing in an input inside modal, don't hijack
  const t = ev.target;
  const tag = (t && t.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return;
  
  // Space toggles start/pause
  if (ev.key === ' ') {
    ev.preventDefault();
    if (readingRunning) {
      pauseReading();
    } else {
      resumeReading();
    }
    return;
  }
  
  
  // j/k adjust WPM in 10 wpm steps (j: down, k: up)
  if (key === 'k') {
    ev.preventDefault();
    const newWpm = Math.min(1200, getCurrentReadingWPM() + 10);
    setCurrentReadingWPM(newWpm);
    
    // Update WPM input field to reflect the change
    const wpmInput = getElementById('wpm');
    if (wpmInput) {
      wpmInput.value = String(newWpm);
    }
    
    if (readingRunning) {
      // Recalculate countdown for remaining words
      const remainingWords = readingWords.length - readingPos;
      if (remainingWords > 0) {
        const remainingTime = Math.ceil((remainingWords / newWpm) * 60);
        startCountdown(remainingTime);
      }
      stepReading();
    }
    updateReadingInfo();
    return;
  }
  
  if (key === 'j') {
    ev.preventDefault();
    handleJournalAction();
    return;
  }
}

/**
 * Handle paragraph key events
 * @param {KeyboardEvent} ev - Keyboard event
 * @param {string} key - Key name
 * @returns {boolean} True if handled
 */
function handleParagraphKey(ev, key) {
  // Don't react if typing inside inputs
  const target = ev.target;
  if (target && (target.tagName || '').toLowerCase() !== 'body' && target !== readingParaEl) {
    return false;
  }
  
  // Controls:
  // v: toggle selection (start at current focus)
  if (key === 'v') { 
    ev.preventDefault(); 
    if (selActive) { 
      clearSelection(); 
    } else { 
      beginSelection(); 
    } 
    return true; 
  }
  
  // 0 and $: jump
  if (key === '0') { 
    ev.preventDefault(); 
    selFocus = 0; 
    if (selActive) applySelection(); 
    return true; 
  }
  if (ev.key === '$') { 
    ev.preventDefault(); 
    selFocus = paraText.length; 
    if (selActive) applySelection(); 
    return true; 
  }
  
  // Navigation keys with modifiers
  if (key === 'h' || key === 'l' || ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
    ev.preventDefault();
    const dir = (key === 'h' || ev.key === 'ArrowLeft') ? -1 : 1;
    
    if (!selActive) {
      // caret-only movement
      if (ev.metaKey || ev.ctrlKey) {
        const next = dir < 0 ? prevSentenceIndex(lastCaretIndex) : nextSentenceIndex(lastCaretIndex);
        setCollapsedCaret(next);
        return true;
      } else if (ev.shiftKey) {
        const next = dir < 0 ? prevWordIndex(lastCaretIndex) : nextWordIndex(lastCaretIndex);
        setCollapsedCaret(next);
        return true;
      } else {
        setCollapsedCaret(lastCaretIndex + dir);
        return true;
      }
    } else {
      // selection mode - extend selection
      if (ev.metaKey || ev.ctrlKey) {
        selFocus = dir < 0 ? prevSentenceIndex(selFocus) : nextSentenceIndex(selFocus);
        applySelection();
        return true;
      } else if (ev.shiftKey) {
        selFocus = dir < 0 ? prevWordIndex(selFocus) : nextWordIndex(selFocus);
        applySelection();
        return true;
      } else {
        moveChar(dir);
        return true;
      }
    }
  }
  
  // Arrow keys for navigation
  if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
    ev.preventDefault();
    const dir = (ev.key === 'ArrowUp') ? -1 : 1;
    
    if (!selActive) {
      setCollapsedCaret(lastCaretIndex + dir);
      return true;
    } else {
      moveChar(dir);
      return true;
    }
  }
  
  // Optional legacy bindings
  if (key === 'w') { 
    ev.preventDefault(); 
    if (!selActive) beginSelection(); 
    selFocus = nextWordIndex(selFocus); 
    applySelection(); 
    return true; 
  }
  if (key === 'b') { 
    ev.preventDefault(); 
    if (!selActive) beginSelection(); 
    selFocus = prevWordIndex(selFocus); 
    applySelection(); 
    return true; 
  }
  if (key === 's') { 
    ev.preventDefault(); 
    if (!selActive) beginSelection(); 
    selFocus = nextSentenceIndex(selFocus); 
    applySelection(); 
    return true; 
  }
  if (key === 'a') { 
    ev.preventDefault(); 
    if (!selActive) beginSelection(); 
    selFocus = prevSentenceIndex(selFocus); 
    applySelection(); 
    return true; 
  }
  
  // c: copy; j: to journal and close
  if (key === 'c') { 
    ev.preventDefault(); 
    copySelection(); 
    return true; 
  }
  if (key === 'j') { 
    ev.preventDefault(); 
    journalSelection(); 
    return true; 
  }
  
  // escape clears selection
  if (key === 'escape') { 
    ev.preventDefault(); 
    clearSelection(); 
    return true; 
  }
  
  return false;
}

/**
 * Clear selection
 */
function clearSelection() {
  selActive = false;
  selAnchor = selFocus;
  selText = '';
  clearNativeSelection();
}

/**
 * Begin selection at current focus
 */
function beginSelection() {
  selActive = true;
  // Prefer current caret/selection inside the paragraph
  const r = getSelectionIfInsidePara();
  if (r) {
    selAnchor = clamp(r.startOffset, 0, paraText.length);
  } else {
    selAnchor = clamp(lastCaretIndex, 0, paraText.length);
  }
  selFocus = selAnchor;
  applySelection();
}

/**
 * Apply current selection
 */
function applySelection() {
  if (!selActive) return;
  
  const start = Math.min(selAnchor, selFocus);
  const end = Math.max(selAnchor, selFocus);
  selText = paraText.substring(start, end);
  
  // Update visual selection
  try {
    const s = window.getSelection();
    if (s && readingParaEl) {
      s.removeAllRanges();
      const range = document.createRange();
      range.setStart(readingParaEl.firstChild, start);
      range.setEnd(readingParaEl.firstChild, end);
      s.addRange(range);
    }
  } catch {}
}

/**
 * Move character in selection
 * @param {number} dir - Direction (-1 or 1)
 */
function moveChar(dir) {
  selFocus = clamp(selFocus + dir, 0, paraText.length);
  applySelection();
}


/**
 * Show feedback message
 * @param {string} message - Feedback message
 */
function showReadingFeedback(message) {
  // Remove any existing feedback
  const existingFeedback = getElementById('readFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create new feedback element
  const feedbackEl = createElement('div', {
    id: 'readFeedback',
    className: 'doodle-feedback',
    style: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#065f46',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: '600',
      zIndex: '10001',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    }
  });
  
  updateTextContent(feedbackEl, message);
  
  // Add to modal
  const modal = getElementById('readModal');
  if (modal) {
    modal.appendChild(feedbackEl);
    
    // Show feedback with slight delay to ensure element is rendered
    setTimeout(() => {
      addClass(feedbackEl, 'show');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
      removeClass(feedbackEl, 'show');
      setTimeout(() => {
        if (feedbackEl.parentNode) {
          feedbackEl.remove();
        }
      }, 300);
    }, 1500); // Show for 1.5 seconds
  }
}

/**
 * Copy selection to clipboard
 */
function copySelection() {
  const t = (selText && selText.trim()) || paraText;
  try {
    navigator.clipboard.writeText(t);
    showReadingFeedback('Copied to clipboard!');
  } catch {
    showReadingFeedback('Copy failed');
  }
}

/**
 * Handle journal action (from main modal)
 */
function handleJournalAction() {
  const txt = (selText && selText.trim()) || paraText;
  try {
    const intent = getElementById('intent');
    if (intent) {
      // Set the textarea to the selected/full paragraph
      intent.value = txt || '';
      // Ensure two newlines at the end for quick continuation typing
      const val = String(intent.value || '');
      const needs = /\n\n$/.test(val) ? '' : (val.endsWith('\n') ? '\n' : '\n\n');
      intent.value = val + needs;
      intent.focus();
    }
    showReadingFeedback('Added to journal!');
    hideReadingModal();
  } catch {
    showReadingFeedback('Journal failed');
  }
}

/**
 * Journal selection and close modal
 */
function journalSelection() {
  const txt = (selText && selText.trim()) || paraText;
  try {
    const intent = getElementById('intent');
    if (intent) {
      // Set the textarea to the selected/full paragraph
      intent.value = txt || '';
      // Ensure two newlines at the end for quick continuation typing
      const val = String(intent.value || '');
      const needs = /\n\n$/.test(val) ? '' : (val.endsWith('\n') ? '\n' : '\n\n');
      intent.value = val + needs;
      intent.focus();
    }
    showReadingFeedback('Added to journal!');
    hideReadingModal();
  } catch {
    showReadingFeedback('Journal failed');
  }
}

/**
 * Get next word index
 * @param {number} index - Current index
 * @returns {number} Next word index
 */
function nextWordIndex(index) {
  const text = paraText;
  let i = index;
  // Skip current word
  while (i < text.length && /\S/.test(text[i])) i++;
  // Skip whitespace
  while (i < text.length && /\s/.test(text[i])) i++;
  return i;
}

/**
 * Get previous word index
 * @param {number} index - Current index
 * @returns {number} Previous word index
 */
function prevWordIndex(index) {
  const text = paraText;
  let i = index;
  // Skip current word
  while (i > 0 && /\S/.test(text[i - 1])) i--;
  // Skip whitespace
  while (i > 0 && /\s/.test(text[i - 1])) i--;
  return i;
}

/**
 * Get next sentence index
 * @param {number} index - Current index
 * @returns {number} Next sentence index
 */
function nextSentenceIndex(index) {
  const text = paraText;
  let i = index;
  // Find sentence end
  while (i < text.length && !/[.!?]/.test(text[i])) i++;
  // Skip to next sentence start
  while (i < text.length && /[.!?\s]/.test(text[i])) i++;
  return i;
}

/**
 * Get previous sentence index
 * @param {number} index - Current index
 * @returns {number} Previous sentence index
 */
function prevSentenceIndex(index) {
  const text = paraText;
  let i = index;
  // Skip current sentence
  while (i > 0 && !/[.!?]/.test(text[i - 1])) i--;
  // Skip to previous sentence start
  while (i > 0 && /[.!?\s]/.test(text[i - 1])) i--;
  return i;
}



/**
 * Handle toggle reading (start/pause/resume)
 */
function handleToggleReading() {
  if (readingRunning) {
    pauseReading();
  } else {
    // Check if we have words to resume or need to start fresh
    if (readingWords.length > 0 && readingPos < readingWords.length) {
      resumeReading();
    } else {
      startReading();
    }
  }
}


/**
 * Handle WPM change
 */
function handleWPMChange() {
  const wpmInput = getElementById('wpm');
  if (!wpmInput) return;
  
  const v = parseInt(wpmInput.value || '250', 10);
  const clamped = Number.isNaN(v) ? 250 : Math.max(60, Math.min(1200, v));
  setCurrentReadingWPM(clamped);
  
  if (readingRunning) {
    // Recalculate countdown for remaining words
    const remainingWords = readingWords.length - readingPos;
    if (remainingWords > 0) {
      const remainingTime = Math.ceil((remainingWords / clamped) * 60);
      startCountdown(remainingTime);
    }
    stepReading();
  }
  
  updateReadingInfo();
}
