/**
 * Presentation layer for Drawing UI
 * Handles drawing interface and user interactions
 */

import { initializeDrawingCanvas, startDrawingStroke, continueDrawingStroke, stopDrawingStroke, saveCanvasState, undoDrawingAction, redoDrawingAction, clearCanvas, adjustCanvasZoom, saveCanvasAsImage, copyCanvasToClipboard, saveDoodleToGallery, copyDoodleToClipboardAndSave, updateCanvasTheme, drawShapeStroke, finalizeShapeStroke } from '../application/DrawingService.js';
import { getElementById, showElement, hideElement, addEventListener, removeEventListener, createElement, updateTextContent, addClass, removeClass } from '../infrastructure/UI.js';
import { isTopModal } from './ModalManager.js';
import { CANVAS_CONFIG } from '../shared/Constants.js';

/**
 * Initialize drawing functionality
 */
export function initializeDrawing() {
  console.log('DrawingController: initializeDrawing called');
  setupDrawingModal();
  setupDrawingControls();
  console.log('DrawingController: initialization complete');
}

/**
 * Setup drawing modal
 */
function setupDrawingModal() {
  console.log('DrawingController: setupDrawingModal called');
  const openBtn = getElementById('doodleBtn');
  const modal = getElementById('doodleModal');
  const closeBtn = getElementById('doodleClose');
  
  console.log('DrawingController: doodleBtn found:', !!openBtn);
  console.log('DrawingController: doodleModal found:', !!modal);
  console.log('DrawingController: doodleClose found:', !!closeBtn);
  
  if (openBtn) {
    addEventListener(openBtn, 'click', showDrawingModal);
    console.log('DrawingController: doodle button click handler added');
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', hideDrawingModal);
    console.log('DrawingController: doodle close button click handler added');
  }
  
  // Modal keydown handler attached to document (like original)
  addEventListener(document, 'keydown', handleModalKeydown);
  
  // Listen for theme changes
  setupThemeListener();
  console.log('DrawingController: setupDrawingModal complete');
}

/**
 * Setup theme change listener
 */
function setupThemeListener() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e) => {
      // Update canvas colors if drawing is active
      if (drawingState) {
        drawingState = updateCanvasTheme(drawingState);
      }
    };
    
    // Listen for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);
    
    // Also listen for storage events (in case theme is changed programmatically)
    addEventListener(window, 'storage', (e) => {
      if (e.key === 'theme' || e.key?.includes('theme')) {
        handleThemeChange();
      }
    });
  }
}

/**
 * Setup drawing controls
 */
function setupDrawingControls() {
  // Clear button removed - using keyboard shortcut instead
}

// Drawing state
let drawingState = null;
let spacePressed = false;
let mouseX = 0;
let mouseY = 0;

/**
 * Show drawing modal
 */
export function showDrawingModal() {
  console.log('DrawingController: showDrawingModal called');
  const modal = getElementById('doodleModal');
  if (!modal) {
    console.log('DrawingController: doodleModal not found');
    return;
  }
  
  addClass(modal, 'show');
  // Remove aria-hidden when modal is shown to allow focus
  modal.removeAttribute('aria-hidden');
  
  const canvas = getElementById('doodleCanvas');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (!container) return;
  
  // Initialize canvas
  drawingState = initializeDrawingCanvas(
    canvas, 
    container.clientWidth, 
    container.clientHeight
  );
  
  if (!drawingState) return;
  
  // Clear canvas and save initial state
  clearCanvas(drawingState);
  drawingState = saveCanvasState(drawingState);
  
  // Ensure theme colors are applied
  drawingState = updateCanvasTheme(drawingState);
  // Default tool
  drawingState.tool = 'pen';
  
  setupCanvasEvents();
  
  // Auto-hide prompt after reading time
  setupPromptAutoHide();
}

/**
 * Hide drawing modal
 */
export function hideDrawingModal() {
  const modal = getElementById('doodleModal');
  if (modal) {
    removeClass(modal, 'show');
    // Restore aria-hidden when modal is hidden
    modal.setAttribute('aria-hidden', 'true');
  }
  
  // Reset drawing state
  drawingState = null;
  spacePressed = false;
  mouseX = 0;
  mouseY = 0;
}

/**
 * Setup prompt auto-hide based on reading speed
 */
function setupPromptAutoHide() {
  const promptEl = getElementById('doodleModal')?.querySelector('.doodle-prompt');
  if (!promptEl) return;
  
  // Get the prompt text
  const promptText = promptEl.textContent || 'Hold spacebar and move your mouse to draw';
  
  // Calculate word count
  const wordCount = promptText.trim().split(/\s+/).length;
  
  // Get average reading speed (words per minute) - default to 200 WPM
  const averageWPM = 200;
  
  // Calculate display time in milliseconds
  const displayTimeMs = (wordCount / averageWPM) * 60 * 1000;
  
  // Add minimum display time of 2 seconds and maximum of 8 seconds
  const minTime = 2000;
  const maxTime = 8000;
  const finalDisplayTime = Math.max(minTime, Math.min(maxTime, displayTimeMs));
  
  // Auto-hide after calculated time
  setTimeout(() => {
    if (promptEl && promptEl.parentNode) {
      addClass(promptEl, 'fade-out');
      
      // Remove element after fade animation
      setTimeout(() => {
        if (promptEl && promptEl.parentNode) {
          promptEl.remove();
        }
      }, 500); // Match CSS transition duration
    }
  }, finalDisplayTime);
}

/**
 * Reset drawing state (exported for global access)
 */
export function resetDrawingState() {
  drawingState = null;
  spacePressed = false;
  mouseX = 0;
  mouseY = 0;
}

/**
 * Setup canvas event listeners
 */
function setupCanvasEvents() {
  const canvas = getElementById('doodleCanvas');
  if (!canvas) return;
  
  // Mouse events
  addEventListener(canvas, 'mousedown', (e) => {
    if (e.button === 0) { // Left mouse button
      drawingState = startDrawingStroke(drawingState, e);
    }
  });
  
  addEventListener(canvas, 'mousemove', (e) => {
    // Track mouse position for zooming
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    if (e.buttons === 1) { // Left mouse button held
      // Always update preview when drawing
      if (drawingState?.isDrawing) {
        drawingState = continueDrawingStroke(drawingState, e);
      }
    } else if (spacePressed && !drawingState?.isDrawing) {
      // Start drawing on first move after Space is pressed so the start point
      // is the exact cursor location, avoiding stale coordinates
      drawingState = startDrawingStroke(drawingState, e);
    } else if (spacePressed && drawingState?.isDrawing) {
      drawingState = continueDrawingStroke(drawingState, e);
    }
  });
  
  addEventListener(canvas, 'mouseup', (e) => {
    if (drawingState?.isDrawing) {
      // If shape tool, draw shape on mouseup
      if (drawingState.tool && drawingState.tool !== 'pen') {
        drawingState = drawShapeStroke(drawingState, e);
      }
      drawingState = stopDrawingStroke(drawingState);
      drawingState = saveCanvasState(drawingState);
    }
  });
  
  addEventListener(canvas, 'mouseleave', () => {
    // Keep ghost visible when leaving; no action needed here
  });

  // Track pointer outside the canvas to keep ghost preview responsive
  addEventListener(document, 'mousemove', (e) => {
    if (!getElementById('doodleModal')?.classList.contains('show')) return;
    const rect = canvas.getBoundingClientRect();
    // Update mouseX/mouseY relative to canvas and clamp to bounds
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    // Do NOT clamp; allow overflow positioning so shapes can exceed canvas bounds
    mouseX = relX;
    mouseY = relY;
    
    if (spacePressed && drawingState?.isDrawing) {
      drawingState = continueDrawingStroke(drawingState, e);
    }
  });
  
  // Spacebar drawing
  addEventListener(document, 'keydown', (e) => {
    if (!getElementById('doodleModal')?.classList.contains('show')) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      spacePressed = true;
      canvas.style.cursor = 'crosshair';
    }
  });
  
  addEventListener(document, 'keyup', (e) => {
    if (!getElementById('doodleModal')?.classList.contains('show')) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      spacePressed = false;
      canvas.style.cursor = 'default';
      if (drawingState?.isDrawing) {
        // Finalize shape if in shape mode
        if (drawingState.tool && drawingState.tool !== 'pen') {
          // Synthesize event at current pointer for final point
          const rect = canvas.getBoundingClientRect();
          const syntheticEvent = {
            clientX: rect.left + mouseX,
            clientY: rect.top + mouseY
          };
          drawingState = finalizeShapeStroke(drawingState, syntheticEvent);
        }
        drawingState = stopDrawingStroke(drawingState);
        drawingState = saveCanvasState(drawingState);
      }
    }
  });
}

/**
 * Handle modal keydown events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleModalKeydown(e) {
  if (!isTopModal('doodleModal')) return;
  if (!getElementById('doodleModal')?.classList.contains('show')) return;
  
  const key = e.key.toLowerCase();
  
  // Zoom controls
  if ((key === '-' || key === '_') && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    drawingState = adjustCanvasZoom(drawingState, -CANVAS_CONFIG.ZOOM_STEP, mouseX, mouseY);
    return;
  }
  
  if ((key === '=' || key === '+') && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    drawingState = adjustCanvasZoom(drawingState, CANVAS_CONFIG.ZOOM_STEP, mouseX, mouseY);
    return;
  }
  
  if ((key === '-' || key === '_') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    drawingState = adjustCanvasZoom(drawingState, -CANVAS_CONFIG.ZOOM_STEP_FAST, mouseX, mouseY);
    return;
  }
  
  if ((key === '=' || key === '+') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    drawingState = adjustCanvasZoom(drawingState, CANVAS_CONFIG.ZOOM_STEP_FAST, mouseX, mouseY);
    return;
  }
  
  // Tool selection: d pen, 1 rectangle, 2 diamond, 3 circle, a arrow, 0 pen
  if (key === 'd') {
    e.preventDefault();
    if (drawingState) drawingState.tool = 'pen';
    showFeedback('Pen tool');
    return;
  }
  if (key === '1') {
    e.preventDefault();
    if (drawingState) drawingState.tool = 'rectangle';
    showFeedback('Rectangle tool');
    return;
  }
  if (key === '2') {
    e.preventDefault();
    if (drawingState) drawingState.tool = 'diamond';
    showFeedback('Diamond tool');
    return;
  }
  if (key === '3') {
    e.preventDefault();
    if (drawingState) drawingState.tool = 'circle';
    showFeedback('Circle tool');
    return;
  }
  if (key === 'a') {
    e.preventDefault();
    if (drawingState) drawingState.tool = 'arrow';
    showFeedback('Arrow tool');
    return;
  }
  if (key === '0') {
    e.preventDefault();
    if (drawingState) drawingState.tool = 'pen';
    showFeedback('Pen tool');
    return;
  }

  // Undo/Redo
  if (key === 'z' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    drawingState = undoDrawingAction(drawingState);
    showFeedback('Undone');
    return;
  }
  
  if (key === 'y' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    drawingState = redoDrawingAction(drawingState);
    showFeedback('Redone');
    return;
  }
  
  // Reset with confirmation
  if (key === 'r') {
    e.preventDefault();
    showConfirmation('Reset all drawing?', () => {
      drawingState = clearCanvas(drawingState);
      drawingState = saveCanvasState(drawingState);
      showFeedback('Reset');
    });
    return;
  }
  
  // Save and copy
  if (key === 's') {
    e.preventDefault();
    handleSaveCanvas();
    return;
  }
  
  if (key === 'c') {
    e.preventDefault();
    handleCopyCanvas();
    return;
  }
  
  
}

/**
 * Handle clear canvas
 */
function handleClearCanvas() {
  showConfirmation('Clear all drawing?', () => {
    drawingState = clearCanvas(drawingState);
    drawingState = saveCanvasState(drawingState);
    showFeedback('Cleared');
  });
}

/**
 * Handle save canvas
 */
async function handleSaveCanvas() {
  const success = await saveCanvasAsImage(drawingState);
  if (success) {
    // Also save to gallery
    await saveDoodleToGallery(drawingState);
    showFeedback('Saved!');
    
    // Update gallery
    if (window.updateDoodleGallery) {
      window.updateDoodleGallery();
    }
  } else {
    showFeedback('Save failed');
  }
}

/**
 * Handle copy canvas
 */
async function handleCopyCanvas() {
  const success = await copyDoodleToClipboardAndSave(drawingState);
  if (success) {
    showFeedback('Copied to clipboard!');
    
    // Update gallery
    if (window.updateDoodleGallery) {
      window.updateDoodleGallery();
    }
  } else {
    showFeedback('Copy failed');
  }
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Confirm callback
 */
function showConfirmation(message, onConfirm) {
  // Prevent multiple confirm modals
  const existing = getElementById('doodleConfirmModal');
  if (existing) return;

  const confirmModal = createElement('div', {
    id: 'doodleConfirmModal',
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10001'
    }
  });
  
  const confirmBox = createElement('div', {
    style: {
      background: '#0b1220',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      color: '#e5e7eb',
      maxWidth: '300px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }
  });
  
  confirmBox.innerHTML = `
    <div style="margin-bottom: 16px; font-weight: 600;">${message}</div>
    <div style="margin-bottom: 16px; font-size: 0.9rem; color: #94a3b8;">Press Y to confirm, N to cancel</div>
    <div style="display: flex; gap: 8px; justify-content: center;">
      <button id="confirmNo" style="background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">No</button>
      <button id="confirmYes" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Yes</button>
    </div>
  `;
  
  confirmModal.appendChild(confirmBox);
  document.body.appendChild(confirmModal);
  
  const cleanup = () => {
    if (confirmModal && confirmModal.parentNode) {
      confirmModal.parentNode.removeChild(confirmModal);
    }
    // Remove key handler to avoid leaks or duplicate handling (must match capture)
    removeEventListener(document, 'keydown', handleKey, { capture: true });
  };
  
  const handleKey = (e) => {
    const key = e.key.toLowerCase();
    if (key === 'y') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      cleanup();
      onConfirm();
    } else if (key === 'n' || key === 'q' || key === 'escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      cleanup();
    }
  };
  
  // Use capture so we intercept before global handlers, and stop propagation
  addEventListener(document, 'keydown', handleKey, { capture: true });
  addEventListener(confirmBox.querySelector('#confirmYes'), 'click', () => {
    cleanup();
    onConfirm();
  });
  addEventListener(confirmBox.querySelector('#confirmNo'), 'click', cleanup);
  addEventListener(confirmModal, 'click', (e) => {
    if (e.target === confirmModal) cleanup();
  });
}

/**
 * Show feedback message
 * @param {string} message - Feedback message
 */
function showFeedback(message) {
  // Remove any existing feedback
  const existingFeedback = getElementById('doodleFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create new feedback element
  const feedbackEl = createElement('div', {
    id: 'doodleFeedback',
    className: 'doodle-feedback'
  });
  
  updateTextContent(feedbackEl, message);
  
  // Add to canvas container so it appears over the canvas
  const container = getElementById('doodleCanvas')?.parentElement;
  if (container) {
    container.appendChild(feedbackEl);
    
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
