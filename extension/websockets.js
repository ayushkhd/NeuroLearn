let socket = null;

chrome.runtime.onInstalled.addListener(() => {
  socket = new WebSocket('ws://localhost:8080');

  socket.addEventListener('open', function () {
    console.log('WebSocket connection established');
  });

  socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    console.log("PLZ GOD", data)
    if (data && data.focusProbability) {
      // Store the data to send it later
      const message = { focusProbability: data.focusProbability };

      // Listen for the tab update event
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // When the tab is fully loaded, send the message
        if (changeInfo.status === 'complete' && tab.active) {
          chrome.tabs.sendMessage(tabId, message);
        }
      });
    }
  });

  socket.addEventListener('error', function (error) {
    console.log('WebSocket error:', error);
  });

  socket.addEventListener('close', function () {
    console.log('WebSocket connection closed');
  });
});