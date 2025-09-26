/**
 * Application layer for Drawing operations
 * Business logic for drawing and canvas management
 */

import { createCanvasState, applyTransform, calculateMousePosition, calculateZoomAdjustment, createStroke, validateCanvasDimensions, calculateDrawingBounds } from '../domain/Drawing.js';
import { setItem, getItem } from '../infrastructure/Storage.js';
import { CANVAS_CONFIG } from '../shared/Constants.js';
import { getThemeColors } from '../shared/Utils.js';

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
  
  // Get theme-aware colors
  const themeColors = getThemeColors();
  
  // Set initial drawing properties
  ctx.fillStyle = themeColors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = themeColors.stroke;
  ctx.lineWidth = CANVAS_CONFIG.DEFAULT_STROKE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  return {
    ...state,
    ctx,
    canvas,
    // Track current theme to allow proper inversion on theme changes
    themeIsDark: (themeColors.background || '').toLowerCase() === '#1a1a1a'
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
  
  // For shapes, capture a snapshot for live preview
  let shapeSnapshot = state.shapeSnapshot;
  if (state.tool && state.tool !== 'pen') {
    shapeSnapshot = state.ctx.getImageData(0, 0, state.canvas.width, state.canvas.height);
  }
  
  return {
    ...state,
    isDrawing: true,
    lastX: pos.x,
    lastY: pos.y,
    shapeSnapshot
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
  
  // For freehand pen tool, draw continuously
  if (state.tool === 'pen') {
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
  } else {
    // For shapes: restore snapshot and draw preview on top
    if (state.shapeSnapshot) {
      state.ctx.putImageData(state.shapeSnapshot, 0, 0);
    }
    // Use the same renderer as finalize, but preview based on current pos
    const previewEvent = event; // pass the real MouseEvent so clientX/clientY are available
    // Apply temporary "ghost" styling (semi-transparent + dashed)
    state.ctx.save();
    try {
      state.ctx.globalAlpha = 0.5;
      if (state.ctx.setLineDash) state.ctx.setLineDash([6, 4]);
      // Use a distinct preview color to ensure visibility
      const prevStroke = state.ctx.strokeStyle;
      const prevWidth = state.ctx.lineWidth;
      state.ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)'; // blue
      state.ctx.lineWidth = prevWidth;
      state = drawShapeStroke(state, previewEvent);
      // Restore stroke style before leaving try
      state.ctx.strokeStyle = prevStroke;
    } finally {
      state.ctx.restore();
      if (state.ctx.setLineDash) state.ctx.setLineDash([]);
    }
    // Do NOT update lastX/lastY for shapes; they represent the fixed start point
    return state;
  }
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
    isDrawing: false,
    shapeSnapshot: null
  };
}

/**
 * Draw a shape based on current tool from last point to current mouse position
 * @param {Object} state - Canvas state
 * @param {MouseEvent} event - Mouse event (for end position)
 * @returns {Object} Updated state
 */
export function drawShapeStroke(state, event) {
  if (!state || !state.ctx || !state.isDrawing) return state;
  if (state.tool === 'pen') return state;
  const pos = calculateMousePosition(event, state.canvas, state.zoom, state.panX, state.panY);
  const startX = state.lastX;
  const startY = state.lastY;

  const ctx = state.ctx;
  ctx.save();
  ctx.scale(state.zoom, state.zoom);
  ctx.translate(state.panX / state.zoom, state.panY / state.zoom);
  ctx.beginPath();

  if (state.tool === 'rectangle') {
    const x = Math.min(startX, pos.x);
    const y = Math.min(startY, pos.y);
    const w = Math.abs(pos.x - startX);
    const h = Math.abs(pos.y - startY);
    ctx.strokeRect(x, y, w, h);
  } else if (state.tool === 'diamond') {
    const cx = (startX + pos.x) / 2;
    const cy = (startY + pos.y) / 2;
    const rx = Math.abs(pos.x - startX) / 2;
    const ry = Math.abs(pos.y - startY) / 2;
    ctx.moveTo(cx, cy - ry);
    ctx.lineTo(cx + rx, cy);
    ctx.lineTo(cx, cy + ry);
    ctx.lineTo(cx - rx, cy);
    ctx.closePath();
    ctx.stroke();
  } else if (state.tool === 'circle') {
    const cx = (startX + pos.x) / 2;
    const cy = (startY + pos.y) / 2;
    const r = Math.min(Math.abs(pos.x - startX), Math.abs(pos.y - startY)) / 2;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (state.tool === 'arrow') {
    // Straight arrow from start to end with arrowhead at end
    const dx = pos.x - startX;
    const dy = pos.y - startY;
    const angle = Math.atan2(dy, dx);
    const headLength = 10; // in canvas units
    ctx.moveTo(startX, startY);
    ctx.lineTo(pos.x, pos.y);
    // Arrowhead
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(
      pos.x - headLength * Math.cos(angle - Math.PI / 6),
      pos.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(
      pos.x - headLength * Math.cos(angle + Math.PI / 6),
      pos.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  ctx.restore();
  return state;
}

/**
 * Finalize shape on mouseup (ensures snapshot restore + final draw)
 * @param {Object} state
 * @param {MouseEvent} event
 * @returns {Object}
 */
export function finalizeShapeStroke(state, event) {
  if (!state || !state.ctx || state.tool === 'pen') return state;
  if (state.shapeSnapshot) {
    state.ctx.putImageData(state.shapeSnapshot, 0, 0);
  }
  state = drawShapeStroke(state, event);
  return state;
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
  
  // Get theme-aware colors
  const themeColors = getThemeColors();
  
  state.ctx.save();
  state.ctx.setTransform(1, 0, 0, 1, 0, 0);
  state.ctx.fillStyle = themeColors.background;
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
    state.height,
    state.panX,
    state.panY
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

/**
 * Save doodle to localStorage gallery
 * @param {Object} state - Canvas state
 * @returns {Promise<boolean>} Success status
 */
export async function saveDoodleToGallery(state) {
  if (!state || !state.canvas) return false;
  
  try {
    const imageData = state.canvas.toDataURL('image/png');
    const doodleData = {
      id: `doodle-${Date.now()}`,
      imageData: imageData,
      timestamp: new Date().toISOString(),
      type: 'saved'
    };
    
    // Get existing doodles
    const existingDoodles = getItem('site-blocker:doodles') || [];
    
    // Add new doodle
    existingDoodles.push(doodleData);
    
    // Keep only last 50 doodles to prevent storage bloat
    const limitedDoodles = existingDoodles.slice(-50);
    
    // Save using infrastructure layer
    setItem('site-blocker:doodles', limitedDoodles);
    
    return true;
  } catch (error) {
    console.error('Error saving doodle to gallery:', error);
    return false;
  }
}

/**
 * Copy doodle to clipboard and save to gallery
 * @param {Object} state - Canvas state
 * @returns {Promise<boolean>} Success status
 */
export async function copyDoodleToClipboardAndSave(state) {
  if (!state || !state.canvas) return false;
  
  try {
    // Copy to clipboard
    const copySuccess = await copyCanvasToClipboard(state);
    
    if (copySuccess) {
      // Also save to gallery
      const imageData = state.canvas.toDataURL('image/png');
      const doodleData = {
        id: `doodle-${Date.now()}`,
        imageData: imageData,
        timestamp: new Date().toISOString(),
        type: 'clipboarded'
      };
      
      // Get existing doodles
      const existingDoodles = getItem('site-blocker:doodles') || [];
      
      // Add new doodle
      existingDoodles.push(doodleData);
      
      // Keep only last 50 doodles to prevent storage bloat
      const limitedDoodles = existingDoodles.slice(-50);
      
      // Save using infrastructure layer
      setItem('site-blocker:doodles', limitedDoodles);
    }
    
    return copySuccess;
  } catch (error) {
    console.error('Error copying doodle and saving to gallery:', error);
    return false;
  }
}

/**
 * Get saved doodles from localStorage
 * @returns {Array} Array of doodle data
 */
export function getSavedDoodles() {
  try {
    return getItem('site-blocker:doodles') || [];
  } catch (error) {
    console.error('Error getting saved doodles:', error);
    return [];
  }
}

/**
 * Update canvas colors based on current theme
 * @param {Object} state - Canvas state
 * @returns {Object} Updated state
 */
export function updateCanvasTheme(state) {
  if (!state || !state.ctx) return state;
  
  // Get current theme colors
  const themeColors = getThemeColors();

  const isDarkNow = (themeColors.background || '').toLowerCase() === '#1a1a1a';

  // If theme changed since last time, invert existing pixels so drawing remains visible
  if (typeof state.themeIsDark === 'boolean' && state.themeIsDark !== isDarkNow) {
    try {
      const { width, height } = state.canvas;
      const imageData = state.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Invert RGB, keep alpha
        data[i] = 255 - data[i];     // R
        data[i+1] = 255 - data[i+1]; // G
        data[i+2] = 255 - data[i+2]; // B
      }
      state.ctx.putImageData(imageData, 0, 0);
    } catch (err) {
      console.warn('Failed to invert canvas on theme change:', err);
      // As a fallback, repaint background only (may obscure previous drawing)
      state.ctx.save();
      state.ctx.setTransform(1, 0, 0, 1, 0, 0);
      state.ctx.globalCompositeOperation = 'destination-over';
      state.ctx.fillStyle = themeColors.background;
      state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
      state.ctx.restore();
    }
  } else if (typeof state.themeIsDark !== 'boolean') {
    // First-time call: ensure background exists under current pixels
    state.ctx.save();
    state.ctx.setTransform(1, 0, 0, 1, 0, 0);
    state.ctx.globalCompositeOperation = 'destination-over';
    state.ctx.fillStyle = themeColors.background;
    state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    state.ctx.restore();
  }

  // Update stroke color for new drawings
  state.ctx.strokeStyle = themeColors.stroke;
  // Update flag
  state.themeIsDark = isDarkNow;

  return state;
}

/**
 * Shuffle array in place (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
