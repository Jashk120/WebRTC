import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

const app = express();
const serverPort = 4443;
const server = http.createServer(app);
const io = new SocketIO(server);

const sockets = {};
const users = {};

// Function to send messages to a specific connection
function sendTo(connection, message) {
  if (connection) {
    connection.emit('message', message);
  }
}

// Serve the main HTML file
app.get('/', (req, res) => {
  console.log('GET /');
  res.sendFile(`${process.cwd()}/src/index.html`);
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (socket.name) {
      socket.broadcast.to('chatroom').emit('roommessage', { type: 'disconnect', username: socket.name });
      delete sockets[socket.name];
      delete users[socket.name];
    }
  });

  // Handle WebRTC signaling
  socket.on('webrtc_signal', (data) => {
    const targetSocket = sockets[data.target];
    if (targetSocket) {
      console.log(`Forwarding WebRTC signal from ${socket.name} to ${data.target}`);
      targetSocket.emit('webrtc_signal', {
        sender: socket.name,
        signal: data.signal,
      });
    } else {
      sendTo(socket, {
        type: 'webrtc_error',
        message: `User ${data.target} is not available`,
      });
    }
  });

  // Handle login
  socket.on('login', (data) => {
    console.log('User logged in:', data.name);

    if (sockets[data.name]) {
      sendTo(socket, {
        type: 'login',
        success: false,
        message: 'Username already in use',
      });
    } else {
      sockets[data.name] = socket;
      socket.name = data.name;

      sendTo(socket, {
        type: 'login',
        success: true,
        username: data.name,
        userlist: Object.keys(users),
      });

      users[data.name] = socket.id;
      socket.join('chatroom');
      socket.broadcast.to('chatroom').emit('roommessage', { type: 'login', username: data.name });
    }
  });

  // Handle call initiation
  socket.on('call_user', (data) => {
    const targetSocket = sockets[data.target];
    if (targetSocket) {
      console.log(`User ${socket.name} is calling ${data.target}`);
      targetSocket.emit('call_user', {
        caller: socket.name,
      });
    } else {
      sendTo(socket, {
        type: 'call_response',
        response: 'offline',
      });
    }
  });

  // Handle call response
  socket.on('call_response', (data) => {
    const callerSocket = sockets[data.caller];
    if (callerSocket) {
      console.log(`Call response from ${socket.name} to ${data.caller}: ${data.response}`);
      callerSocket.emit('call_response', {
        response: data.response,
        responder: socket.name,
      });
    }
  });
});

// Start the server
server.listen(serverPort, () => {
  console.log('Server up and running at http://localhost:%s', serverPort);
});
