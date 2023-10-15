let socket = null;

chrome.runtime.onInstalled.addListener(() => {
  socket = new WebSocket('ws://localhost:8080');
  console.log("connected!")

  socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    console.log("HEYHO", data)
    if (data && data.focusProbability) {
      // Send a message to the content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { focusProbability: data.focusProbability });
        console.log("HEYYY")
      });
    }
  });
});