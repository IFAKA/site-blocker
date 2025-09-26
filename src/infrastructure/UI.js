/**
 * Infrastructure layer for UI operations
 * Handles DOM manipulation and UI utilities
 */

/**
 * Show a DOM element
 * @param {HTMLElement} element - Element to show
 * @returns {boolean} Success status
 */
export function showElement(element) {
  if (!element) return false;
  try {
    element.style.display = '';
    element.classList.remove('hidden');
    return true;
  } catch (error) {
    console.warn('Failed to show element:', error);
    return false;
  }
}

/**
 * Hide a DOM element
 * @param {HTMLElement} element - Element to hide
 * @returns {boolean} Success status
 */
export function hideElement(element) {
  if (!element) return false;
  try {
    element.style.display = 'none';
    return true;
  } catch (error) {
    console.warn('Failed to hide element:', error);
    return false;
  }
}

/**
 * Update text content of an element
 * @param {HTMLElement} element - Element to update
 * @param {string} text - Text content
 * @returns {boolean} Success status
 */
export function updateTextContent(element, text) {
  if (!element) return false;
  try {
    element.textContent = text || '';
    return true;
  } catch (error) {
    console.warn('Failed to update text content:', error);
    return false;
  }
}

/**
 * Update innerHTML of an element
 * @param {HTMLElement} element - Element to update
 * @param {string} html - HTML content
 * @returns {boolean} Success status
 */
export function updateInnerHTML(element, html) {
  if (!element) return false;
  try {
    element.innerHTML = html || '';
    return true;
  } catch (error) {
    console.warn('Failed to update innerHTML:', error);
    return false;
  }
}

/**
 * Add CSS class to element
 * @param {HTMLElement} element - Element to modify
 * @param {string} className - Class name to add
 * @returns {boolean} Success status
 */
export function addClass(element, className) {
  if (!element || !className) return false;
  try {
    element.classList.add(className);
    return true;
  } catch (error) {
    console.warn('Failed to add class:', error);
    return false;
  }
}

/**
 * Remove CSS class from element
 * @param {HTMLElement} element - Element to modify
 * @param {string} className - Class name(s) to remove (space-separated for multiple)
 * @returns {boolean} Success status
 */
export function removeClass(element, className) {
  if (!element || !className) return false;
  try {
    // Handle multiple class names separated by spaces
    const classNames = className.trim().split(/\s+/);
    classNames.forEach(cls => {
      if (cls) {
        element.classList.remove(cls);
      }
    });
    return true;
  } catch (error) {
    console.warn('Failed to remove class:', error);
    return false;
  }
}

/**
 * Toggle CSS class on element
 * @param {HTMLElement} element - Element to modify
 * @param {string} className - Class name to toggle
 * @returns {boolean} Success status
 */
export function toggleClass(element, className) {
  if (!element || !className) return false;
  try {
    element.classList.toggle(className);
    return true;
  } catch (error) {
    console.warn('Failed to toggle class:', error);
    return false;
  }
}

/**
 * Create a DOM element
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} content - Element content
 * @returns {HTMLElement|null} Created element or null
 */
export function createElement(tag, attributes = {}, content = '') {
  try {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Set content
    if (content) {
      element.textContent = content;
    }
    
    return element;
  } catch (error) {
    console.warn('Failed to create element:', error);
    return null;
  }
}

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
export function getElementById(id) {
  try {
    return document.getElementById(id);
  } catch (error) {
    console.warn('Failed to get element by ID:', error);
    return null;
  }
}

/**
 * Query selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {HTMLElement|null} Element or null
 */
export function querySelector(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn('Failed to query selector:', error);
    return null;
  }
}

/**
 * Query selector all
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {NodeList} Elements
 */
export function querySelectorAll(selector, parent = document) {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.warn('Failed to query selector all:', error);
    return [];
  }
}

/**
 * Add event listener to element
 * @param {HTMLElement} element - Element to add listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {boolean} Success status
 */
export function addEventListener(element, event, handler, options = {}) {
  if (!element || !event || typeof handler !== 'function') return false;
  try {
    element.addEventListener(event, handler, options);
    return true;
  } catch (error) {
    console.warn('Failed to add event listener:', error);
    return false;
  }
}

/**
 * Remove event listener from element
 * @param {HTMLElement} element - Element to remove listener from
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @returns {boolean} Success status
 */
export function removeEventListener(element, event, handler, options = undefined) {
  if (!element || !event || typeof handler !== 'function') return false;
  try {
    // Pass options to ensure capture/passive/once match when removing
    if (options !== undefined) {
      element.removeEventListener(event, handler, options);
    } else {
      element.removeEventListener(event, handler);
    }
    return true;
  } catch (error) {
    console.warn('Failed to remove event listener:', error);
    return false;
  }
}

/**
 * Focus an element
 * @param {HTMLElement} element - Element to focus
 * @returns {boolean} Success status
 */
export function focusElement(element) {
  if (!element) return false;
  try {
    element.focus();
    return true;
  } catch (error) {
    console.warn('Failed to focus element:', error);
    return false;
  }
}

/**
 * Blur an element
 * @param {HTMLElement} element - Element to blur
 * @returns {boolean} Success status
 */
export function blurElement(element) {
  if (!element) return false;
  try {
    element.blur();
    return true;
  } catch (error) {
    console.warn('Failed to blur element:', error);
    return false;
  }
}

/**
 * Scroll element into view
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 * @returns {boolean} Success status
 */
export function scrollIntoView(element, options = {}) {
  if (!element) return false;
  try {
    element.scrollIntoView(options);
    return true;
  } catch (error) {
    console.warn('Failed to scroll into view:', error);
    return false;
  }
}

/**
 * Get element bounding rectangle
 * @param {HTMLElement} element - Element to measure
 * @returns {DOMRect|null} Bounding rectangle or null
 */
export function getBoundingRect(element) {
  if (!element) return null;
  try {
    return element.getBoundingClientRect();
  } catch (error) {
    console.warn('Failed to get bounding rect:', error);
    return null;
  }
}
