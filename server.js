const path = require('path');
const express = require("express");
const app = express();
const {createServer} = require('http');

app.use(express.static('build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/build/index.html`))
})

const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const {Server} = require("socket.io");
const io = new Server(httpServer);

io.on('connection', function(socket) {
  socket.on('send', function(board){
      io.emit('receive', board);
  });
});
httpServer.listen(PORT);
