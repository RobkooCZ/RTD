const socket = io();

// Object to store incoming data for different message types
const receivedData = {
  towerData: [],
  upgradeData: []
};

/**
 * Sends data to the server with a specified type.
 * @param {string} messageType - The type of message (e.g., 'towerData', 'upgradeData').
 * @param {Object} data - The data to send to the server.
 */
function sendDataToServer(messageType, data) {
  socket.emit(messageType, data);
}

/**
 * Listens for incoming data from other players based on message type and stores it.
 * @param {string} messageType - The type of message to listen for (e.g., 'towerDataForPlayer', 'upgradeDataForPlayer').
 */
function acceptData(messageType) {
  socket.on(messageType, (msg) => {
    if (receivedData[messageType]) {
      receivedData[messageType].push(msg); // Store the received data
    }
  });
}

/**
 * Retrieves and clears the stored data for a specific message type.
 * Call this in the game loop to get new data and avoid duplicates.
 * @param {string} messageType - The type of message to retrieve (e.g., 'towerData', 'upgradeData').
 * @returns {Array} An array of new data messages for the specified message type.
 */
function getNewData(messageType) {
  const data = [...(receivedData[messageType] || [])]; // Copy the data if it exists
  receivedData[messageType] = []; // Clear the stored data
  return data;
}

/**
 * Retrieves the socket ID of the current connection.
 * @returns {string} The socket ID.
 */
function getSocketID() {
  return socket.id;
}

// Initialize data listeners for specific message types
acceptData('towerDataForPlayer');
acceptData('upgradeDataForPlayer');