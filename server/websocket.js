const WebSocket = require('ws');
const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST || 'localhost' });

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Someone has connected');

  ws.on('message', (message) => {
    console.log("ws.on message: ", message);
  })
});

client.on('message', (channel, message) => { // all channels for now
  console.log(`subscriber hears message: ${message}`);
  wss.clients.forEach((client) => {
    client.send(message);
  });
});

client.subscribe('listing');
client.subscribe('inquiry');