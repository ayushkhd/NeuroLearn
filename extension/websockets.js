const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function () {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data);
  if (data && data.focusProbability) {
    // Send a message to the content script
    window.postMessage({ type: "FROM_PAGE", focusProbability: data.focusProbability }, "*");
  }
});

socket.addEventListener('error', function (error) {
  console.log('WebSocket error:', error);
});

socket.addEventListener('close', function () {
  console.log('WebSocket connection closed');
});