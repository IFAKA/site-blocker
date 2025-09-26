/**
 * Presentation layer for Mirror UI
 * Handles mirror interface with camera access and 5-second timer
 */

import { 
  getElementById, 
  addEventListener, 
  addClass,
  removeClass,
  updateTextContent
} from '../infrastructure/UI.js';

let mirrorStream = null;
let mirrorTimer = null;
let mirrorCountdown = 5;
let mirrorCanvas = null;
let mirrorContext = null;
let capturedImageData = null;

/**
 * Initialize mirror functionality
 */
export function initializeMirror() {
  setupMirrorControls();
  setupMirrorModal();
}

/**
 * Setup mirror controls
 */
function setupMirrorControls() {
  const mirrorBtn = getElementById('mirrorBtn');
  if (mirrorBtn) {
    addEventListener(mirrorBtn, 'click', showMirrorModal);
  }
}

/**
 * Setup mirror modal
 */
function setupMirrorModal() {
  const mirrorModal = getElementById('mirrorModal');
  const mirrorClose = getElementById('mirrorClose');
  
  if (mirrorClose) {
    addEventListener(mirrorClose, 'click', hideMirrorModal);
  }
  
  // Make showMirrorModal globally available for keyboard shortcuts
  window.showMirrorModal = showMirrorModal;
}

/**
 * Show mirror modal and start camera
 */
async function showMirrorModal() {
  const mirrorModal = getElementById('mirrorModal');
  const mirrorVideo = getElementById('mirrorVideo');
  const mirrorTimerEl = getElementById('mirrorTimer');
  mirrorCanvas = getElementById('mirrorCanvas');
  
  if (!mirrorModal || !mirrorVideo || !mirrorTimerEl || !mirrorCanvas) return;
  
  try {
    // Request camera access
    mirrorStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      } 
    });
    
    // Set video source
    mirrorVideo.srcObject = mirrorStream;
    
    // Setup canvas for photo capture
    mirrorContext = mirrorCanvas.getContext('2d');
    mirrorCanvas.width = 640;
    mirrorCanvas.height = 480;
    
    // Show modal
    addClass(mirrorModal, 'show');
    mirrorModal.setAttribute('aria-hidden', 'false');
    
    // No mirroring - just normal video
    
    // Start 5-second countdown
    startMirrorCountdown();
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Unable to access camera. Please check permissions.');
  }
}

/**
 * Hide mirror modal and stop camera
 */
function hideMirrorModal() {
  const mirrorModal = getElementById('mirrorModal');
  const mirrorVideo = getElementById('mirrorVideo');
  
  if (!mirrorModal || !mirrorVideo) return;
  
  // Stop camera stream
  if (mirrorStream) {
    mirrorStream.getTracks().forEach(track => track.stop());
    mirrorStream = null;
  }
  
  // Clear video source
  mirrorVideo.srcObject = null;
  
  // Clear timer
  if (mirrorTimer) {
    clearInterval(mirrorTimer);
    mirrorTimer = null;
  }
  
  // Reset countdown
  mirrorCountdown = 5;
  
  // Hide modal
  removeClass(mirrorModal, 'show');
  mirrorModal.setAttribute('aria-hidden', 'true');
}

/**
 * Reset mirror modal state (exported for global access)
 */
export function resetMirrorModal() {
  // Stop camera stream
  if (mirrorStream) {
    mirrorStream.getTracks().forEach(track => track.stop());
    mirrorStream = null;
  }
  
  // Clear timer
  if (mirrorTimer) {
    clearInterval(mirrorTimer);
    mirrorTimer = null;
  }
  
  // Reset countdown
  mirrorCountdown = 5;
}

/**
 * Start mirror countdown timer
 */
function startMirrorCountdown() {
  const mirrorTimerEl = getElementById('mirrorTimer');
  if (!mirrorTimerEl) return;
  
  mirrorCountdown = 5;
  updateTextContent(mirrorTimerEl, mirrorCountdown.toString());
  
  mirrorTimer = setInterval(() => {
    mirrorCountdown--;
    updateTextContent(mirrorTimerEl, mirrorCountdown.toString());
    
    if (mirrorCountdown <= 0) {
      hideMirrorModal();
    }
  }, 1000);
}

/**
 * Capture photo from video and copy to clipboard
 */
async function capturePhoto() {
  const mirrorVideo = getElementById('mirrorVideo');
  if (!mirrorVideo) return;
  
  try {
    console.log('Capturing photo, video dimensions:', mirrorVideo.videoWidth, 'x', mirrorVideo.videoHeight);
    console.log('Video transform:', mirrorVideo.style.transform);
    
    // Create temporary canvas for mirroring
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = mirrorVideo.videoWidth;
    canvas.height = mirrorVideo.videoHeight;
    
    // Draw video normally (no mirroring)
    ctx.drawImage(mirrorVideo, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob and copy to clipboard
    canvas.toBlob(async (blob) => {
      try {
        const clipboardItemInput = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([clipboardItemInput]);
        showMirrorFeedback('Photo copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy mirrored image', err);
        showMirrorFeedback('Error copying photo');
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('Error capturing photo:', error);
    showMirrorFeedback('Error copying photo');
  }
}


/**
 * Show mirror feedback message
 * @param {string} message - Feedback message
 */
function showMirrorFeedback(message) {
  const feedback = getElementById('mirrorFeedback');
  if (!feedback) return;
  
  feedback.textContent = message;
  feedback.classList.add('show');
  
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 2000);
}

/**
 * Handle mirror keyboard shortcuts
 * @param {KeyboardEvent} ev - Keyboard event
 */
export function handleMirrorKeydown(ev) {
  const key = ev.key.toLowerCase();
  
  // Only handle shortcuts when mirror modal is open
  const mirrorModal = getElementById('mirrorModal');
  if (!mirrorModal || !mirrorModal.classList.contains('show')) return false;
  
  if (key === 'q') {
    ev.preventDefault();
    hideMirrorModal();
    return true;
  }
  
  if (key === ' ') { // Spacebar
    ev.preventDefault();
    capturePhoto();
    return true;
  }
  
  // Handle ? key to show shortcuts modal
  if (key === '?') {
    ev.preventDefault();
    if (window.showShortcutsModal) {
      window.showShortcutsModal('mirror');
    }
    return true;
  }
  
  return false;
}
