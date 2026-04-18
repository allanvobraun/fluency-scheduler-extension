function handleInstalled(): void {
  console.log('Fluency extension installed.');
}

chrome.runtime.onInstalled.addListener(handleInstalled);
