const socket = io();
const createLobbyButton = document.getElementById("createLobbyButton");
const joinLobbyButton = document.getElementById("joinLobbyButton");
const lobbyDiv = document.getElementById('lobby');
const mainLobby = document.getElementById('mainLobby');
const playerList = document.getElementById('playerList'); 
const lobbyIDh2 = document.querySelector('.lobbyID');

const startGameBTN = document.getElementById('startButton');

const mapRadios = document.querySelectorAll('.mapOptions input[type="radio"]');
const gamemodeRadios = document.querySelectorAll('.gameModeOptions input[type="radio"]');

createLobbyButton.addEventListener('click', function() { // change the ui after player has created a lobby
    const playerName = document.getElementById('username').value;
    if (playerName){ // only create the lobby if the user has entered a valid (non-empty) name
        socket.on("lobbyCreated", (lobbyId, socketId, playerName) => {
            if (socketId === socket.id){
                lobbyDiv.classList.add('active');
                mainLobby.classList.add('active');
                lobbyIDh2.textContent = `Lobby ID: ${lobbyId}`;
                const listItem = document.createElement('li');
                listItem.textContent = playerName;
                playerList.appendChild(listItem);
            }
        });
    }
});

joinLobbyButton.addEventListener('click', function() { // change the ui if the user has joined a lobby
    const playerName = document.getElementById('username').value;
    if (playerName){ // only join a lobby if the user has entered a valid (non-empty) name
        socket.on("joinedLobby", (lobbyId) => {
            if (lobbyId === document.getElementById('lobbyID').value){
                lobbyDiv.classList.add('active');
                mainLobby.classList.add('active');
                lobbyIDh2.textContent = `Lobby ID: ${lobbyId}`;
            }
        });
    }
});

function createLobby(){
    const playerName = document.getElementById('username').value;
    if (!playerName){ // warn the user if they had entered nothing as the username
        alert("Please write your name before creating a lobby.");
        return;
    }
    socket.emit('createLobby', 2, playerName);
}

function joinLobby(){ // a function to send data to the server to join the lobby
    const lobbyID = document.getElementById('lobbyID').value;
    const playerName = document.getElementById('username').value;

    if (!playerName){
        alert("Please write your name before joining a lobby.");
        return;
    }

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

startGameBTN.addEventListener('click', function(){ // check if the user has picked all the options before starting a game
    const isAnyMapRadioChecked = Array.from(mapRadios).some(radio => radio.checked);
    const isAnyGamemodeRadioChecked = Array.from(gamemodeRadios).some(radio => radio.checked);

    if (!isAnyMapRadioChecked || !isAnyGamemodeRadioChecked){
        alert('Please select a map and gamemode before proceeding');
        return;
    }

    // put the user choices into localstorage for later use
    localStorage.setItem('selectedMap', document.querySelector('.mapOptions input[type="radio"]:checked').value);
    localStorage.setItem('selectedGamemode', document.querySelector('.gameModeOptions input[type="radio"]:checked').value);
});

socket.on('playerJoined', (players) => { // update the player list after a player has joined a lobby
    players.forEach(player => {
        if (!(player.id === socket.id)){
            const listItem = document.createElement('li');
            listItem.textContent = player.name;
            playerList.appendChild(listItem);
        }
    });
});