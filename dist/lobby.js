const socket = io();
const createLobbyButton = document.getElementById("createLobbyButton");
const joinLobbyButton = document.getElementById("joinLobbyButton");
const lobbyDiv = document.getElementById('lobby');
const playerList = document.getElementById('playerList'); 
let lobbyCreation = false;

createLobbyButton.addEventListener('click', function() {
    socket.on("lobbyCreated", (lobbyId, socketId, playerName) => {
        if (socketId === socket.id){
            lobbyDiv.classList.add('active');
            const listItem = document.createElement('li');
            listItem.textContent = playerName;
            playerList.appendChild(listItem);
        }
    });
});

joinLobbyButton.addEventListener('click', function() {
    socket.on("joinedLobby", (lobbyId) => {
        if (lobbyId === document.getElementById('lobbyID').value){
            lobbyDiv.classList.add('active');
        }
    });
});

function createLobby(){
    const playerName = document.getElementById('username').value;
    socket.emit('createLobby', 2, playerName);
}

function joinLobby(){
    const lobbyID = document.getElementById('lobbyID').value;
    const playerName = document.getElementById('username').value;
    socket.emit('joinLobby', lobbyID, playerName);
    socket.on('playerJoined', (players) => {
        players.forEach(player => {
            if ((player.id === socket.id)){
                const listItem = document.createElement('li');
                listItem.textContent = player.name;
                playerList.appendChild(listItem);
            }
        });
    });
}

socket.on('playerJoined', (players) => {
    players.forEach(player => {
        if (!(player.id === socket.id)){
            const listItem = document.createElement('li');
            listItem.textContent = player.name;
            playerList.appendChild(listItem);
        }
    });
});