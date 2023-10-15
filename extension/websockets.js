// const WS_URL = 'ws://localhost:8080';
// const RECONNECT_DELAY = 5000; // 5 seconds

// let socket = null;
// let message = null;

// function setupWebSocket() {
//     socket = new WebSocket(WS_URL);

//     socket.addEventListener('open', function() {
//         console.log('WebSocket connection established');
//     });

//     socket.addEventListener('message', function(event) {
//         try {
//             const data = JSON.parse(event.data);
//             console.log("Received data:", data);
//             if (data && data.focusProbability) {
//                 // Store the data to send it later
//                 message = { focusProbability: data.focusProbability };
//             }
//         } catch (err) {
//             console.error('Error parsing WebSocket message:', err);
//         }
//     });

//     socket.addEventListener('close', function() {
//         console.log('WebSocket connection closed. Reconnecting in', RECONNECT_DELAY / 1000, 'seconds...');
//         setTimeout(setupWebSocket, RECONNECT_DELAY); // Attempt to reconnect after a delay
//     });

//     socket.addEventListener('error', function(err) {
//         console.error('WebSocket error:', err);
//     });
// }

// // Initialize WebSocket connection
// setupWebSocket();

// // Listen for the webNavigation onCompleted event
// chrome.webNavigation.onCompleted.addListener(function(details) {
//     if (message) {
//         console.log("Sending message to tab:", message);
//         chrome.tabs.sendMessage(details.tabId, message);
//         message = null; // Clear the message after sending it
//     }
// });

const WS_URL = 'ws://localhost:8060';
const RECONNECT_DELAY = 5000; // 5 seconds

let socket = null;
let message = null;

function setupWebSocket() {
    socket = new WebSocket(WS_URL);

    socket.addEventListener('open', function() {
        console.log('WebSocket connection established');
    });

    socket.addEventListener('message', function(event) {
        try {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);
            if (data && data.focusProbability) {
                // Directly send the data to the active YouTube tab
                broadcastToYouTubeTab({ focusProbability: data.focusProbability });
            }
        } catch (err) {
            console.error('Error parsing WebSocket message:', err);
        }
    });

    socket.addEventListener('close', function() {
        console.log('WebSocket connection closed. Reconnecting in', RECONNECT_DELAY / 1000, 'seconds...');
        setTimeout(setupWebSocket, RECONNECT_DELAY); // Attempt to reconnect after a delay
    });

    socket.addEventListener('error', function(err) {
        console.error('WebSocket error:', err);
    });
}

function broadcastToYouTubeTab(message) {
    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            if (tab.url && tab.url.includes('youtube.com')) {
                chrome.tabs.sendMessage(tab.id, message);
            }
        }
    });
}

// Initialize WebSocket connection
setupWebSocket();
