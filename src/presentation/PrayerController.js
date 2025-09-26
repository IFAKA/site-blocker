/**
 * Presentation layer for Prayer functionality
 * Handles prayer timer and state management
 */

import { getElementById, updateTextContent, addEventListener } from '../infrastructure/UI.js';
import { playBeep, playPrayerCompleteBeep } from '../infrastructure/Audio.js';
import { setItem, getItem } from '../infrastructure/Storage.js';

// Prayer state
let prayerTimer = null;
let prayerSeconds = 60;
let isPrayerActive = false;

/**
 * Initialize prayer functionality
 */
export function initializePrayer() {
  console.log('PrayerController: initializePrayer called');
  
  // Make prayer functions globally accessible
  window.startPrayer = startPrayer;
  window.cancelPrayer = cancelPrayer;
  window.isPrayerActive = () => isPrayerActive;
  
  console.log('PrayerController: Prayer functions made globally accessible');
}

/**
 * Start prayer session
 */
export function startPrayer() {
  console.log('PrayerController: startPrayer called, isActive:', isPrayerActive);
  
  if (isPrayerActive) {
    console.log('PrayerController: Prayer already active, canceling');
    cancelPrayer();
    return;
  }
  
  isPrayerActive = true;
  prayerSeconds = 60;
  
  // Show countdown in progress summary
  const countdownEl = getElementById('prayerCountdown');
  if (countdownEl) {
    countdownEl.style.display = 'block';
    updateTextContent(countdownEl, '60s');
  }
  
  // Update button state if it exists
  const prayBtn = getElementById('prayBtn');
  if (prayBtn) {
    prayBtn.textContent = 'Cancel prayer';
    prayBtn.classList.add('active');
  }
  
  prayerTimer = setInterval(() => {
    prayerSeconds -= 1;
    
    // Update countdown in progress summary
    if (countdownEl) {
      updateTextContent(countdownEl, `${String(prayerSeconds % 60).padStart(2, '0')}s`);
    }
    
    if (prayerSeconds <= 0) {
      completePrayer();
    }
  }, 1000);
  
  console.log('PrayerController: Playing start beep');
  playBeep(800, 160);
}

/**
 * Cancel prayer session
 */
export function cancelPrayer() {
  console.log('PrayerController: cancelPrayer called');
  
  if (prayerTimer) {
    clearInterval(prayerTimer);
    prayerTimer = null;
  }
  
  isPrayerActive = false;
  
  // Hide countdown in progress summary
  const countdownEl = getElementById('prayerCountdown');
  if (countdownEl) {
    countdownEl.style.display = 'none';
  }
  
  // Update button state if it exists
  const prayBtn = getElementById('prayBtn');
  if (prayBtn) {
    prayBtn.textContent = '1‑min prayer';
    prayBtn.classList.remove('active');
  }
}

/**
 * Complete prayer session
 */
function completePrayer() {
  console.log('PrayerController: completePrayer called');
  
  if (prayerTimer) {
    clearInterval(prayerTimer);
    prayerTimer = null;
  }
  
  isPrayerActive = false;
  
  // Hide countdown in progress summary
  const countdownEl = getElementById('prayerCountdown');
  if (countdownEl) {
    countdownEl.style.display = 'none';
  }
  
  // Update button state if it exists
  const prayBtn = getElementById('prayBtn');
  if (prayBtn) {
    prayBtn.textContent = '1‑min prayer';
    prayBtn.classList.remove('active');
  }
  
  console.log('PrayerController: Prayer complete, playing beep');
  playPrayerCompleteBeep();
  
  // Save prayer statistics
  savePrayerStatistics();
  
  // Update progress chart
  if (window.updatePrayerProgressChart) {
    window.updatePrayerProgressChart();
  }
}

/**
 * Save prayer statistics
 */
function savePrayerStatistics() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stats = getItem('prayerStats') || {};
    
    if (!stats[today]) {
      stats[today] = { sessions: 0, totalTime: 0 };
    }
    
    stats[today].sessions += 1;
    stats[today].totalTime += 60; // 60 seconds per session
    
    setItem('prayerStats', stats);
    console.log('PrayerController: Prayer statistics saved');
  } catch (error) {
    console.error('PrayerController: Error saving prayer statistics:', error);
  }
}
