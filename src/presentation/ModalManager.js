/**
 * Centralized Modal Management
 * Handles all modal keyboard events and closing logic
 */

import { getElementById, querySelector, querySelectorAll } from '../infrastructure/UI.js';
import { hideShortcutsModal, showShortcutsModal } from './ShortcutsController.js';

// Modal close handlers
const modalCloseHandlers = {
  'readModal': () => {
    if (window.hideReadingModal) window.hideReadingModal();
  },
  'doodleModal': () => {
    if (window.hideDrawingModal) window.hideDrawingModal();
  },
  'eyeHealthModal': () => {
    if (window.hideEyeHealthModal) window.hideEyeHealthModal();
  },
  'mindModal': () => {
    if (window.hideMindModal) window.hideMindModal();
  },
  'chineseModal': () => {
    if (window.hideChineseModal) window.hideChineseModal();
  },
  'mirrorModal': () => {
    if (window.hideMirrorModal) window.hideMirrorModal();
  },
  'shortcutsModal': () => {
    hideShortcutsModal();
  }
};

// Modal context mapping
const modalContextMap = {
  'readModal': 'reading',
  'doodleModal': 'drawing',
  'eyeHealthModal': 'eyeHealth',
  'mindModal': 'mind',
  'chineseModal': 'chinese',
  'mirrorModal': 'mirror'
};

/**
 * Handle modal keyboard events
 * @param {KeyboardEvent} ev - Keyboard event
 * @returns {boolean} True if event was handled
 */
export function handleModalKeydown(ev) {
  const key = ev.key.toLowerCase();
  
  // Check if shortcuts modal is open (highest priority)
  const shortcutsModal = getElementById('shortcutsModal');
  if (shortcutsModal && shortcutsModal.classList.contains('show')) {
    if (key === 'q' || key === 'escape' || key === '?') {
      ev.preventDefault();
      hideShortcutsModal();
      return true;
    }
    return false; // Let other shortcuts modal keys pass through
  }
  
  // If any modal is open, handle modal-specific shortcuts
  const anyModalOpen = !!querySelector('.modal.show');
  if (anyModalOpen) {
    // Get all open modals to determine the most recent one
    const openModals = querySelectorAll('.modal.show');
    if (openModals.length > 0) {
      // Get the most recently opened modal (last in the list)
      const topModal = openModals[openModals.length - 1];
      
      // Handle close keys
      if (key === 'q' || key === 'escape') {
        ev.preventDefault();
        const closeHandler = modalCloseHandlers[topModal.id];
        if (closeHandler) {
          closeHandler();
        }
        return true;
      }
      
      // Handle ? key to show shortcuts modal for the current modal
      if (key === '?') {
        ev.preventDefault();
        const context = getShortcutsContext();
        showShortcutsModal(context);
        return true;
      }
      
      // Let modal-specific handlers process other keys
      return false;
    }
  }
  
  return false;
}

/**
 * Get shortcuts context based on currently open modals
 * @returns {string} Context type for shortcuts modal
 */
export function getShortcutsContext() {
  // Check if any modal is open
  const anyModalOpen = !!querySelector('.modal.show');
  if (anyModalOpen) {
    // Get all open modals to determine the most recent one
    const openModals = querySelectorAll('.modal.show');
    if (openModals.length > 0) {
      // Get the most recently opened modal (last in the list)
      const topModal = openModals[openModals.length - 1];
      
      return modalContextMap[topModal.id] || 'global';
    }
  }
  
  // If no modal is open, show global shortcuts
  return 'global';
}

/**
 * Initialize modal manager
 */
export function initializeModalManager() {
  // This will be called by the main keyboard controller
  console.log('ModalManager initialized');
}
