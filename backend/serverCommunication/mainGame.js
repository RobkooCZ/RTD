const socket = io();

function sendTowerDataToServer(gridX, gridY, towerType) {
  socket.emit('towerData', { gridX, gridY, towerType });
}

function acceptData(){
  socket.on('towerDataForPlayer', (msg) => {
    return msg;
  });
}