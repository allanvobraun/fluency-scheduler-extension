console.log('Background service worker running...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and background script active.');
});
