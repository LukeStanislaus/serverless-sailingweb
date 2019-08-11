const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let id = 0
let lookup = []
wss.on('connection', function connection(ws) {
    ws.id = id++
    lookup[ws.id] = ws
  ws.on('message', function incoming(message) {
      console.log(message);
    lookup.forEach(elem=>elem.send(message))
  });

});