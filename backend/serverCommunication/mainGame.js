const socket = io();

// Array to store incoming tower data
const receivedTowerData = [];

/**
 * Sends tower data to the server.
 * @param {number} gridX - The grid X-coordinate of the tower.
 * @param {number} gridY - The grid Y-coordinate of the tower.
 * @param {string} towerType - The type of tower being placed.
 */
function sendTowerDataToServer(gridX, gridY, towerType) {
  socket.emit('towerData', { gridX, gridY, towerType });
}

/**
 * Listens for incoming tower data from other players and stores it.
 */
function acceptData() {
  socket.on('towerDataForPlayer', (msg) => {
    receivedTowerData.push(msg); // Store the received tower data
  });
}

/**
 * Retrieves and clears the stored tower data.
 * Call this in the game loop to get new data and avoid duplicates.
 * @returns {Array} An array of new tower data messages.
 */
function getNewTowerData() {
  const data = [...receivedTowerData]; // Copy the data
  receivedTowerData.length = 0; // Clear the stored data
  return data;
}

// Initialize the data listener
acceptData();