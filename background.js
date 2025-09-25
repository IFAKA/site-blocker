/**
 * Background service worker for Simple Site Blocker
 * Handles extension lifecycle and communication
 */

// Extension installation/startup
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Simple Site Blocker installed/updated');
  
  // Set up default rules if needed
  if (details.reason === 'install') {
    console.log('First time installation');
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open the blocked page in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('blocked.html')
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'redirectToBlocked') {
    chrome.tabs.update(sender.tab.id, {
      url: chrome.runtime.getURL('blocked.html')
    });
  }
  return true;
});
