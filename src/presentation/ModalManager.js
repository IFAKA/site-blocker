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
  'doodleViewModal': () => {
    if (window.hideDoodleModal) window.hideDoodleModal();
  },
  'eyeHealthModal': () => {
    if (window.hideEyeHealthModal) window.hideEyeHealthModal();
  },
  'mindModal': () => {
    if (window.hideMindModal) window.hideMindModal();
  },
  'brainTrainingModal': () => {
    if (window.hideBrainTrainingModal) window.hideBrainTrainingModal();
  },
  'chineseModal': () => {
    if (window.hideChineseModal) window.hideChineseModal();
  },
  'mirrorModal': () => {
    if (window.hideMirrorModal) window.hideMirrorModal();
  },
  'galleryModal': () => {
    if (window.hideGalleryModal) window.hideGalleryModal();
  },
  'exerciseModal': () => {
    if (window.hideExerciseModal) window.hideExerciseModal();
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
  'brainTrainingModal': 'brainTraining',
  'chineseModal': 'chinese',
  'mirrorModal': 'mirror',
  'galleryModal': 'gallery',
  'exerciseModal': 'exercise'
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
  
  // If drawing confirmation modal is open, consume close keys so parent doodle modal stays open
  const doodleConfirm = getElementById('doodleConfirmModal');
  if (doodleConfirm && doodleConfirm.parentNode) {
    if (key === 'q' || key === 'escape') {
      ev.preventDefault();
      // Let the confirmation's own handler deal with closing itself.
      return true;
    }
    // Block other modal-level handling while confirmation is present
    return true;
  }

  // If journal confirmation modal is open, let it consume keys and block globals
  const journalConfirm = getElementById('journalConfirmModal');
  if (journalConfirm && journalConfirm.parentNode) {
    if (key === 'q' || key === 'escape') {
      ev.preventDefault();
      return true;
    }
    return true; // block other modal-level handling while confirmation is present
  }

  // Check if delete confirmation modal is open - let gallery handler deal with it
  const deleteModal = getElementById('deleteConfirmModal');
  if (deleteModal && deleteModal.classList.contains('show')) {
    return false; // Let gallery keyboard shortcuts handle this modal
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
        
        // Special handling for doodleViewModal when gallery is open
        if (topModal.id === 'doodleViewModal') {
          const galleryModal = document.getElementById('galleryModal');
          if (galleryModal && galleryModal.classList.contains('show')) {
            // Let gallery handler deal with this - it will close the doodle modal and stay in gallery
            return false;
          }
        }
        
        // Special handling for galleryModal - let gallery handler deal with group navigation and selections
        if (topModal.id === 'galleryModal') {
          // Check if we're inside a group (currentGroupIndex is set by gallery handler)
          if (window.currentGroupIndex !== undefined && window.currentGroupIndex >= 0) {
            // Let gallery handler deal with this - it will handle group navigation
            return false;
          }
          
          // Check if there are selections (selectedItems is set by gallery handler)
          if (window.selectedItems !== undefined && window.selectedItems.size > 0) {
            // Let gallery handler deal with this - it will handle selection cancellation
            return false;
          }
        }
        
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
 * Return the id of the top-most open modal, or null
 */
export function getTopOpenModalId() {
  const anyModalOpen = !!querySelector('.modal.show');
  if (!anyModalOpen) return null;
  const openModals = querySelectorAll('.modal.show');
  if (!openModals || openModals.length === 0) return null;
  const topModal = openModals[openModals.length - 1];
  return topModal ? topModal.id : null;
}

/**
 * Check if the given modal id is the top-most open modal
 * @param {string} modalId
 * @returns {boolean}
 */
export function isTopModal(modalId) {
  return getTopOpenModalId() === modalId;
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
