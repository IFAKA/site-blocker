/**
 * Presentation layer for Keyboard Shortcuts Modal
 * Handles displaying keyboard shortcuts for different sections
 */

import { getElementById, addEventListener, addClass, removeClass, updateTextContent, updateInnerHTML } from '../infrastructure/UI.js';

/**
 * Initialize keyboard shortcuts modal
 */
export function initializeShortcutsModal() {
  setupShortcutsModal();
}

/**
 * Setup shortcuts modal event listeners
 */
function setupShortcutsModal() {
  const shortcutsModal = getElementById('shortcutsModal');
  const shortcutsClose = getElementById('shortcutsClose');
  
  if (shortcutsClose) {
    addEventListener(shortcutsClose, 'click', () => {
      hideShortcutsModal();
    });
  }
  
  // Close modal when clicking outside
  if (shortcutsModal) {
    addEventListener(shortcutsModal, 'click', (e) => {
      if (e.target === shortcutsModal) {
        hideShortcutsModal();
      }
    });
  }
}

/**
 * Show shortcuts modal with specific content
 * @param {string} type - Type of shortcuts to show
 */
export function showShortcutsModal(type = 'global') {
  const shortcutsModal = getElementById('shortcutsModal');
  const shortcutsTitle = getElementById('shortcutsTitle');
  const shortcutsContent = getElementById('shortcutsContent');
  
  if (!shortcutsModal || !shortcutsTitle || !shortcutsContent) {
    console.error('Missing modal elements for shortcuts modal');
    return;
  }
  
  // Update title
  const titles = {
    global: 'Global Keyboard Shortcuts',
    reading: 'Reading Modal Shortcuts',
    drawing: 'Drawing Modal Shortcuts',
    eyeHealth: 'Eye Health Modal Shortcuts',
    mind: 'Mind Exercises Modal Shortcuts',
    chinese: 'Chinese Learning Modal Shortcuts',
    mirror: 'Mirror Modal Shortcuts'
  };
  
  updateTextContent(shortcutsTitle, titles[type] || 'Keyboard Shortcuts');
  
  // Update content
  updateInnerHTML(shortcutsContent, getShortcutsContent(type));
  
  // Show modal
  addClass(shortcutsModal, 'show');
}

/**
 * Hide shortcuts modal
 */
export function hideShortcutsModal() {
  const shortcutsModal = getElementById('shortcutsModal');
  if (shortcutsModal) {
    removeClass(shortcutsModal, 'show');
  }
}

/**
 * Get shortcuts content for specific type
 * @param {string} type - Type of shortcuts
 * @returns {string} HTML content
 */
function getShortcutsContent(type) {
  const shortcuts = {
    global: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Global Navigation</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>p</strong> - Prayer</div>
          <div><strong>r</strong> - Reading</div>
          <div><strong>s</strong> - Exercise</div>
          <div><strong>j</strong> - Focus intent</div>
          <div><strong>i</strong> - Focus intent</div>
          <div><strong>l</strong> - List mode</div>
          <div><strong>d</strong> - Drawing</div>
          <div><strong>e</strong> - Eye health</div>
          <div><strong>m</strong> - Mind exercises</div>
          <div><strong>c</strong> - Chinese learning</div>
          <div><strong>v</strong> - Mirror</div>
          <div><strong>q</strong> - Close modals</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Intent Management</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>enter</strong> - Save intent</div>
          <div><strong>x</strong> - Clear intent</div>
          <div><strong>escape</strong> - Cancel/blur</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Exercise & Eye Health</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>n</strong> - Skip exercise/phase</div>
          <div><strong>t</strong> - Reset exercise/cycle</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">List Mode</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>j</strong> - Move down</div>
          <div><strong>k</strong> - Move up</div>
          <div><strong>c</strong> - Copy selected</div>
          <div><strong>escape</strong> - Exit list mode</div>
        </div>
      </div>
    `,
    
    reading: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Reading Modal Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>space</strong> - Start/pause reading</div>
          <div><strong>k</strong> - Increase WPM (+10)</div>
          <div><strong>j</strong> - Journal selection mode</div>
          <div><strong>q</strong> - Close modal</div>
          <div><strong>escape</strong> - Close modal</div>
        </div>
      </div>
    `,
    
    drawing: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Drawing Modal Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>space</strong> - Hold to draw</div>
          <div><strong>z</strong> - Undo</div>
          <div><strong>y</strong> - Redo</div>
          <div><strong>r</strong> - Reset canvas</div>
          <div><strong>s</strong> - Save drawing</div>
          <div><strong>c</strong> - Copy drawing</div>
          <div><strong>+</strong> - Zoom in</div>
          <div><strong>-</strong> - Zoom out</div>
          <div><strong>⌘++</strong> - Zoom in fast</div>
          <div><strong>⌘+-</strong> - Zoom out fast</div>
          <div><strong>escape</strong> - Close modal</div>
        </div>
      </div>
    `,
    
    eyeHealth: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Eye Health Modal Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>n</strong> - Skip current phase</div>
          <div><strong>t</strong> - Reset entire cycle</div>
          <div><strong>q</strong> - Close modal</div>
        </div>
      </div>
    `,
    
    mind: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Mind Exercises Modal Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>i</strong> - Focus answer input</div>
          <div><strong>h</strong> - Show hint</div>
          <div><strong>n</strong> - Skip exercise</div>
          <div><strong>r</strong> - Reset session</div>
          <div><strong>s</strong> - Start/stop session</div>
          <div><strong>space</strong> - Start session</div>
          <div><strong>enter</strong> - Submit answer</div>
          <div><strong>escape</strong> - Unfocus input</div>
        </div>
      </div>
    `,
    
    chinese: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Chinese Learning Modal Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>space</strong> - Toggle recording</div>
          <div><strong>a</strong> - Replay recording</div>
          <div><strong>w</strong> - Speak word</div>
          <div><strong>s</strong> - Speak sentence only</div>
          <div><strong>r</strong> - Random word</div>
          <div><strong>n</strong> - Next word</div>
          <div><strong>p</strong> - Previous word</div>
          <div><strong>q</strong> - Close modal</div>
        </div>
      </div>
    `,
    
    mirror: `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 600;">Mirror Modal Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #64748b;">
          <div><strong>space</strong> - Capture photo</div>
          <div><strong>q</strong> - Close modal</div>
        </div>
      </div>
    `
  };
  
  return shortcuts[type] || shortcuts.global;
}

/**
 * Setup event listeners for all shortcuts buttons
 */
export function setupShortcutsButtons() {
  // Global shortcuts button
  const globalShortcutsBtn = getElementById('globalShortcutsBtn');
  if (globalShortcutsBtn) {
    addEventListener(globalShortcutsBtn, 'click', () => {
      showShortcutsModal('global');
    });
  }
  
  // Modal shortcuts buttons
  const modalButtons = [
    { id: 'readShortcutsBtn', type: 'reading' },
    { id: 'doodleShortcutsBtn', type: 'drawing' },
    { id: 'eyeShortcutsBtn', type: 'eyeHealth' },
    { id: 'mindShortcutsBtn', type: 'mind' },
    { id: 'chineseShortcutsBtn', type: 'chinese' },
    { id: 'mirrorShortcutsBtn', type: 'mirror' }
  ];
  
  modalButtons.forEach(({ id, type }) => {
    const button = getElementById(id);
    if (button) {
      addEventListener(button, 'click', () => {
        showShortcutsModal(type);
      });
    }
  });
}
