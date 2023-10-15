const WebSocket = require('ws');
const EventEmitter = require('events');

class FocusEmitter extends EventEmitter {}

const focusEmitter = new FocusEmitter();

const wss = new WebSocket.Server({ port: 8060 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // This function will be executed every time there's a new focus score
    const sendFocusScore = (focusScore) => {
        ws.send(JSON.stringify({ focusProbability: focusScore }));
    };

    // Attach the event listener
    focusEmitter.on('newFocusScore', sendFocusScore);
    
    // When the client disconnects, remove the listener to avoid potential memory leaks
    ws.on('close', () => {
        focusEmitter.removeListener('newFocusScore', sendFocusScore);
    });

    // Initial test message (can be removed if you no longer need it)
    ws.send(JSON.stringify({ focusProbability: Math.random() }));
});

console.log('WebSocket server started on port 8060');

module.exports = focusEmitter;
