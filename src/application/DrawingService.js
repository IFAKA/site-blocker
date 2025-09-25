/**
 * Application layer for Drawing operations
 * Business logic for drawing and canvas management
 */

import { createCanvasState, applyTransform, calculateMousePosition, calculateZoomAdjustment, createStroke, validateCanvasDimensions, calculateDrawingBounds } from '../domain/Drawing.js';
import { CANVAS_CONFIG } from '../shared/Constants.js';

/**
 * Initialize drawing canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Object} Canvas state
 */
export function initializeDrawingCanvas(canvas, width, height) {
  if (!canvas) return null;
  
  const validatedDimensions = validateCanvasDimensions(width, height);
  const state = createCanvasState(validatedDimensions.width, validatedDimensions.height);
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  
  // Set canvas size
  canvas.width = validatedDimensions.width;
  canvas.height = validatedDimensions.height;
  
  // Set initial drawing properties
  ctx.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = CANVAS_CONFIG.DEFAULT_STROKE_COLOR;
  ctx.lineWidth = CANVAS_CONFIG.DEFAULT_STROKE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  return {
    ...state,
    ctx,
    canvas
  };
}

/**
 * Start drawing stroke
 * @param {Object} state - Canvas state
 * @param {MouseEvent} event - Mouse event
 * @returns {Object} Updated state
 */
export function startDrawingStroke(state, event) {
  if (!state || !state.ctx) return state;
  
  const pos = calculateMousePosition(event, state.canvas, state.zoom, state.panX, state.panY);
  
  return {
    ...state,
    isDrawing: true,
    lastX: pos.x,
    lastY: pos.y
  };
}

/**
 * Continue drawing stroke
 * @param {Object} state - Canvas state
 * @param {MouseEvent} event - Mouse event
 * @returns {Object} Updated state
 */
export function continueDrawingStroke(state, event) {
  if (!state || !state.ctx || !state.isDrawing) return state;
  
  const pos = calculateMousePosition(event, state.canvas, state.zoom, state.panX, state.panY);
  
  // Draw line
  state.ctx.save();
  state.ctx.scale(state.zoom, state.zoom);
  state.ctx.translate(state.panX / state.zoom, state.panY / state.zoom);
  state.ctx.beginPath();
  state.ctx.moveTo(state.lastX, state.lastY);
  state.ctx.lineTo(pos.x, pos.y);
  state.ctx.stroke();
  state.ctx.restore();
  
  return {
    ...state,
    lastX: pos.x,
    lastY: pos.y
  };
}

/**
 * Stop drawing stroke
 * @param {Object} state - Canvas state
 * @returns {Object} Updated state
 */
export function stopDrawingStroke(state) {
  if (!state) return state;
  
  return {
    ...state,
    isDrawing: false
  };
}

/**
 * Save current canvas state for undo
 * @param {Object} state - Canvas state
 * @returns {Object} Updated state
 */
export function saveCanvasState(state) {
  if (!state || !state.ctx) return state;
  
  const imageData = state.ctx.getImageData(0, 0, state.canvas.width, state.canvas.height);
  const undoStack = [...state.undoStack, imageData];
  
  // Limit undo stack size
  if (undoStack.length > CANVAS_CONFIG.MAX_UNDO_STACK) {
    undoStack.shift();
  }
  
  return {
    ...state,
    undoStack,
    redoStack: [] // Clear redo stack when new action is performed
  };
}

/**
 * Undo last drawing action
 * @param {Object} state - Canvas state
 * @returns {Object} Updated state
 */
export function undoDrawingAction(state) {
  if (!state || !state.ctx || state.undoStack.length <= 1) return state;
  
  const currentState = state.undoStack.pop();
  const redoStack = [...state.redoStack, currentState];
  const previousState = state.undoStack[state.undoStack.length - 1];
  
  if (previousState) {
    state.ctx.putImageData(previousState, 0, 0);
  }
  
  return {
    ...state,
    undoStack: [...state.undoStack],
    redoStack
  };
}

/**
 * Redo drawing action
 * @param {Object} state - Canvas state
 * @returns {Object} Updated state
 */
export function redoDrawingAction(state) {
  if (!state || !state.ctx || state.redoStack.length === 0) return state;
  
  const nextState = state.redoStack.pop();
  const undoStack = [...state.undoStack, nextState];
  
  state.ctx.putImageData(nextState, 0, 0);
  
  return {
    ...state,
    undoStack,
    redoStack: [...state.redoStack]
  };
}

/**
 * Clear canvas
 * @param {Object} state - Canvas state
 * @returns {Object} Updated state
 */
export function clearCanvas(state) {
  if (!state || !state.ctx) return state;
  
  state.ctx.save();
  state.ctx.setTransform(1, 0, 0, 1, 0, 0);
  state.ctx.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
  state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  state.ctx.restore();
  
  return {
    ...state,
    undoStack: [],
    redoStack: []
  };
}

/**
 * Adjust canvas zoom
 * @param {Object} state - Canvas state
 * @param {number} delta - Zoom delta
 * @param {number} centerX - Zoom center X
 * @param {number} centerY - Zoom center Y
 * @returns {Object} Updated state
 */
export function adjustCanvasZoom(state, delta, centerX = null, centerY = null) {
  if (!state) return state;
  
  const adjustment = calculateZoomAdjustment(
    state.zoom, 
    delta, 
    centerX, 
    centerY, 
    state.width, 
    state.height
  );
  
  if (adjustment.zoom === state.zoom) return state;
  
  return {
    ...state,
    zoom: adjustment.zoom,
    panX: adjustment.panX,
    panY: adjustment.panY
  };
}

/**
 * Save canvas as image
 * @param {Object} state - Canvas state
 * @param {string} filename - Filename for download
 * @returns {Promise<boolean>} Success status
 */
export async function saveCanvasAsImage(state, filename = `doodle-${Date.now()}.png`) {
  if (!state || !state.canvas) return false;
  
  try {
    const imageData = state.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = imageData;
    link.click();
    return true;
  } catch (error) {
    console.error('Error saving canvas:', error);
    return false;
  }
}

/**
 * Copy canvas to clipboard
 * @param {Object} state - Canvas state
 * @returns {Promise<boolean>} Success status
 */
export async function copyCanvasToClipboard(state) {
  if (!state || !state.canvas) return false;
  
  try {
    const blob = await new Promise(resolve => {
      state.canvas.toBlob(resolve);
    });
    
    if (blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error copying canvas:', error);
    return false;
  }
}
