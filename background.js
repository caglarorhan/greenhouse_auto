// Background service worker
console.log('Background service worker started');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('Extension installed');
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received in background:', request);
  sendResponse({ status: 'received' });
  return true;
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url);
  }
});
