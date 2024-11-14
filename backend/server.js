/* 
**************************************************
************** DECLARING VARIABLES ***************
**************************************************
*/

const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server);
const lobbies = {};

// Dynamically import chalk for colored console output
let chalk;
(async () => {
    const chalkModule = await import('chalk');
    chalk = chalkModule.default;
})();

/* 
**************************************************
***************** SERVING FILES ******************
**************************************************
*/

// Serve static files from 'src/public/styles' for CSS
app.use('/styles', express.static(path.join(__dirname, '..', 'src', 'public', 'styles')));

// Serve static files from 'dist' for JavaScript
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

// Serve static files from 'dist/serverCommunication' for JavaScript
app.use('/serverCommunication', express.static(path.join(__dirname, '..', 'backend', 'serverCommunication')));

// Serve static files from 'public' for HTML
app.use('/html', express.static(path.join(__dirname, '..', 'src', 'public'))); 

// Serve tower images
app.use('/towerImages', express.static(path.join(__dirname, '..', 'src', 'towers', 'images')));

// Serve mainmenu.html from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.resolve('mainmenu.html'));
});

/* 
*************************************************
***************** SERVER STUFF ******************
*************************************************
*/

/**
 * Broadcasts a message with data to all players except the sender.
 * @param {Socket} socket - The socket object of the sender.
 * @param {string} messageType - The type of message (e.g., 'towerData', 'playerMove').
 * @param {Object} data - The data to broadcast, structured according to the messageType.
 */

function broadcastMessage(socket, messageType, data) {
  socket.broadcast.emit(messageType, data);
}

// Set up connection event listener for Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle creating a lobby
  socket.on('createLobby', (maxPlayers = 2, playerName) => {
    const lobbyId = generateLobbyId();
    lobbies[lobbyId] = { players: [{id: socket.id, name: playerName}], maxPlayers };

    socket.join(lobbyId); // Join the Socket.io room
    socket.emit('lobbyCreated', lobbyId, socket.id, playerName);
    console.log(`Lobby ${chalk.green(lobbyId)} created by player ${chalk.green(playerName)} (${chalk.red(socket.id)})`);
  });

  // Handle joining a lobby
  socket.on('joinLobby', (lobbyId, playerName) => {
    const lobby = lobbies[lobbyId];
    if (lobby && lobby.players.length < lobby.maxPlayers) {
      lobby.players.push({id: socket.id, name: playerName});
      socket.join(lobbyId);
      socket.emit('joinedLobby', lobbyId);
      io.to(lobbyId).emit('playerJoined', lobby.players);
      console.log(`Player ${chalk.green(playerName)} (${chalk.red(socket.id)}) joined lobby ${chalk.green(lobbyId)}`);
    } 
    else {
      socket.emit('error', { message: "Lobby is full or doesn't exist" });
    }
  });

  // Handle leaving a lobby
  socket.on('leaveLobby', (lobbyId) => {
    const lobby = lobbies[lobbyId];
    if (lobby) {
      lobby.players = lobby.players.filter((id) => id !== socket.id);
      socket.leave(lobbyId);
      io.to(lobbyId).emit('playerLeft', lobby.players.length);

      if (lobby.players.length === 0) {
        delete lobbies[lobbyId]; // Remove empty lobby
        console.log(`Lobby ${lobbyId} deleted`);
      }
      socket.emit('leftLobby', lobbyId);
      console.log(`Player ${socket.id} left lobby ${lobbyId}`);
    }
  });

  // Clean up when a player disconnects
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    for (const lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];
      if (lobby.players.includes(socket.id)) {
        lobby.players = lobby.players.filter((id) => id !== socket.id);
        io.to(lobbyId).emit('playerLeft', lobby.players.length);

        if (lobby.players.length === 0) {
          delete lobbies[lobbyId];
          console.log(`Lobby ${lobbyId} deleted`);
        }
      }
    }
  });

  socket.on('towerData', (msg) => {
    console.log('Tower data received:', msg);
    // Broadcasting the data to all other players
    broadcastMessage(socket, 'towerDataForPlayer', msg);
  });

  // Listen for upgrade data from a client
  socket.on('upgradeData', (msg) => {
    // Use the function to broadcast to all other players
    console.log('Upgrade data received:', msg);
    broadcastMessage(socket, 'upgradeDataForPlayer', msg);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Utility function to generate a lobby ID
function generateLobbyId() {
  return Math.random().toString(36).substring(2, 8);
}

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});