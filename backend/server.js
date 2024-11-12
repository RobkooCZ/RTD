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

// Function to broadcast tower data to all players except the sender
function sendTowerDataToPlayer(socket, gridX, gridY, towerType) {
  socket.broadcast.emit('towerDataForPlayer', { gridX, gridY, towerType });
}

// Set up connection event listener for Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for tower data from a client
  socket.on('towerData', (msg) => {
    // Use the function to broadcast to all other players
    console.log('Tower data received:', msg);
    sendTowerDataToPlayer(socket, msg.gridX, msg.gridY, msg.towerType);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});