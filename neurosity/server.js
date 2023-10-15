const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');
});

wss.on('connection', ws => {
    console.log('Client connected');
    
    // Send a test message to the client
    ws.send(JSON.stringify({ focusProbability: Math.random() }));
    
    ws.on('message', message => {
      const data = JSON.parse(message);
      console.log('Received data:', data);
    });
  });