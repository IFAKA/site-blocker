/**
 * Domain layer for Drawing functionality
 * Pure business logic for canvas drawing
 */

/**
 * Create initial canvas state
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Object} Canvas state object
 */
export function createCanvasState(width, height) {
  return {
    width,
    height,
    zoom: 1,
    panX: 0,
    panY: 0,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    // Current drawing tool: 'pen' | 'rectangle' | 'diamond' | 'circle' | 'arrow'
    tool: 'pen',
    // Holds a full-canvas ImageData snapshot while previewing shapes
    shapeSnapshot: null,
    undoStack: [],
    redoStack: []
  };
}

/**
 * Apply canvas transformations
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} zoom - Zoom level
 * @param {number} panX - Pan X offset
 * @param {number} panY - Pan Y offset
 */
export function applyTransform(ctx, zoom, panX, panY) {
  ctx.save();
  ctx.setTransform(zoom, 0, 0, zoom, panX, panY);
}

/**
 * Calculate mouse position relative to canvas with transformations
 * @param {MouseEvent} event - Mouse event
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} zoom - Current zoom level
 * @param {number} panX - Current pan X
 * @param {number} panY - Current pan Y
 * @returns {Object} Mouse position
 */
export function calculateMousePosition(event, canvas, zoom, panX, panY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - panX) / zoom,
    y: (event.clientY - rect.top - panY) / zoom
  };
}

/**
 * Calculate zoom adjustment
 * @param {number} currentZoom - Current zoom level
 * @param {number} delta - Zoom delta
 * @param {number} centerX - Zoom center X
 * @param {number} centerY - Zoom center Y
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {Object} New zoom and pan values
 */
export function calculateZoomAdjustment(currentZoom, delta, centerX, centerY, canvasWidth, canvasHeight, currentPanX, currentPanY) {
  const newZoom = Math.max(0.1, Math.min(5, currentZoom + delta));
  
  if (newZoom === currentZoom) {
    return { zoom: currentZoom, panX: currentPanX, panY: currentPanY };
  }
  
  // If no center point provided, use canvas center (screen coords relative to canvas)
  const Sx = centerX !== null ? centerX : canvasWidth / 2;
  const Sy = centerY !== null ? centerY : canvasHeight / 2;
  
  // Maintain the world point under the cursor: S = W*z + pan
  // W = (S - pan)/z; require S = W*z' + pan' => pan' = S - ((S - pan)/z)*z'
  const panXPrime = Sx - ((Sx - currentPanX) / currentZoom) * newZoom;
  const panYPrime = Sy - ((Sy - currentPanY) / currentZoom) * newZoom;
  
  return {
    zoom: newZoom,
    panX: panXPrime,
    panY: panYPrime
  };
}

/**
 * Create drawing stroke data
 * @param {number} startX - Start X coordinate
 * @param {number} startY - Start Y coordinate
 * @param {number} endX - End X coordinate
 * @param {number} endY - End Y coordinate
 * @param {string} color - Stroke color
 * @param {number} width - Stroke width
 * @returns {Object} Stroke data
 */
export function createStroke(startX, startY, endX, endY, color = '#000000', width = 2) {
  return {
    startX,
    startY,
    endX,
    endY,
    color,
    width,
    timestamp: Date.now()
  };
}

/**
 * Validate canvas dimensions
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Object} Validated dimensions
 */
export function validateCanvasDimensions(width, height) {
  return {
    width: Math.max(100, Math.min(4000, width)),
    height: Math.max(100, Math.min(4000, height))
  };
}

/**
 * Calculate canvas bounds for drawing
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} zoom - Current zoom
 * @param {number} panX - Current pan X
 * @param {number} panY - Current pan Y
 * @returns {Object} Drawing bounds
 */
export function calculateDrawingBounds(width, height, zoom, panX, panY) {
  return {
    minX: -panX / zoom,
    maxX: (width - panX) / zoom,
    minY: -panY / zoom,
    maxY: (height - panY) / zoom
  };
}
