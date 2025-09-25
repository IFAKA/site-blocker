/**
 * Presentation layer for Drawing UI
 * Handles drawing interface and user interactions
 */

import { initializeDrawingCanvas, startDrawingStroke, continueDrawingStroke, stopDrawingStroke, saveCanvasState, undoDrawingAction, redoDrawingAction, clearCanvas, adjustCanvasZoom, saveCanvasAsImage, copyCanvasToClipboard } from '../application/DrawingService.js';
import { getElementById, showElement, hideElement, addEventListener, createElement, updateTextContent, addClass, removeClass } from '../infrastructure/UI.js';
import { CANVAS_CONFIG } from '../shared/Constants.js';

/**
 * Initialize drawing functionality
 */
export function initializeDrawing() {
  setupDrawingModal();
  setupDrawingControls();
}

/**
 * Setup drawing modal
 */
function setupDrawingModal() {
  const openBtn = getElementById('doodleBtn');
  const modal = getElementById('doodleModal');
  const closeBtn = getElementById('doodleClose');
  
  if (openBtn) {
    addEventListener(openBtn, 'click', showDrawingModal);
  }
  
  if (closeBtn) {
    addEventListener(closeBtn, 'click', hideDrawingModal);
  }
  
  // Modal keydown handler attached to document (like original)
  addEventListener(document, 'keydown', handleModalKeydown);
}

/**
 * Setup drawing controls
 */
function setupDrawingControls() {
  const clearBtn = getElementById('doodleClear');
  
  if (clearBtn) {
    addEventListener(clearBtn, 'click', handleClearCanvas);
  }
}

// Drawing state
let drawingState = null;
let spacePressed = false;
let mouseX = 0;
let mouseY = 0;

/**
 * Show drawing modal
 */
function showDrawingModal() {
  const modal = getElementById('doodleModal');
  if (!modal) return;
  
  addClass(modal, 'show');
  
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
  
  setupCanvasEvents();
}

/**
 * Hide drawing modal
 */
function hideDrawingModal() {
  const modal = getElementById('doodleModal');
  if (modal) {
    removeClass(modal, 'show');
  }
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
      drawingState = continueDrawingStroke(drawingState, e);
    } else if (spacePressed && !drawingState?.isDrawing) {
      drawingState = startDrawingStroke(drawingState, e);
    } else if (spacePressed && drawingState?.isDrawing) {
      drawingState = continueDrawingStroke(drawingState, e);
    }
  });
  
  addEventListener(canvas, 'mouseup', () => {
    if (drawingState?.isDrawing) {
      drawingState = stopDrawingStroke(drawingState);
      drawingState = saveCanvasState(drawingState);
    }
  });
  
  addEventListener(canvas, 'mouseleave', () => {
    if (drawingState?.isDrawing) {
      drawingState = stopDrawingStroke(drawingState);
      drawingState = saveCanvasState(drawingState);
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
  
  // Close modal
  if (key === 'escape') {
    e.preventDefault();
    hideDrawingModal();
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
    showFeedback('Saved!');
  } else {
    showFeedback('Save failed');
  }
}

/**
 * Handle copy canvas
 */
async function handleCopyCanvas() {
  const success = await copyCanvasToClipboard(drawingState);
  if (success) {
    showFeedback('Copied to clipboard!');
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
  const confirmModal = createElement('div', {
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
    document.body.removeChild(confirmModal);
  };
  
  const handleKey = (e) => {
    const key = e.key.toLowerCase();
    if (key === 'y') {
      e.preventDefault();
      cleanup();
      onConfirm();
    } else if (key === 'n' || key === 'q' || key === 'escape') {
      e.preventDefault();
      cleanup();
    }
  };
  
  addEventListener(document, 'keydown', handleKey);
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
  const panel = getElementById('doodleModal')?.querySelector('.panel');
  if (panel) {
    panel.appendChild(feedbackEl);
    
    // Show feedback
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
    }, 1000);
  }
}
