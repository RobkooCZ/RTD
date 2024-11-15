function clearAllRadioChoices(radioNodeList) {
    radioNodeList.forEach(radio => {
        radio.checked = false;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    let menuStage = 0; 

    const playButton = document.getElementById('playButton');
    const buttonsDiv = document.getElementsByClassName('buttonsDiv')[0];
    const userMapChoice = document.getElementsByClassName('userMapChoice')[0];
    const userGamemodeChoice = document.getElementsByClassName('userGamemodeChoice')[0];
    const confirmButton = document.getElementsByClassName('confirmMap')[0];
    const allRadios = document.querySelectorAll('input[type="radio"]');
    const mapRadios = document.querySelectorAll('.userMapChoice input[type="radio"]');
    const gamemodeRadios = document.querySelectorAll('.userGamemodeChoice input[type="radio"]');
    const confirmGamemodeButton = document.getElementsByClassName('confirmGamemode')[0];
    const backButton1 = document.getElementsByClassName('backButton')[0];
    const backButton2 = document.getElementsByClassName('backButton')[1];
    const backButton3 = document.getElementsByClassName('backButton')[2];
    const spButton = document.getElementById('spButton');
    const mpButton = document.getElementById('mpButton');
    const userPlayerChoice = document.getElementsByClassName('userPlayerChoice')[0];

    clearAllRadioChoices(allRadios);   

    playButton.addEventListener('click', function() {
        menuStage++;
        
        if (menuStage === 1) {
            buttonsDiv.classList.add('active');
            userPlayerChoice.classList.add('active');
        }
    });


    spButton.addEventListener('click', function() {
        localStorage.setItem('selectedPlayer', 'singleplayer');
        menuStage++;

        if (menuStage === 2) {
            buttonsDiv.classList.add('active');
            userPlayerChoice.classList.remove('active');
            userMapChoice.classList.add('active');
        }
    });

    mpButton.addEventListener('click', function() {
        localStorage.setItem('selectedPlayer', 'multiplayer');
        window.location.href = '/html/lobby.html';
    });

    confirmButton.addEventListener('click', function() {
        if (menuStage === 2) {
            // Check if any radio button is checked
            const isAnyRadioChecked = Array.from(mapRadios).some(radio => radio.checked);

            if (!isAnyRadioChecked) {
                alert('Please select a map before proceeding.');
                return;
            }

            localStorage.setItem('selectedMap', document.querySelector('.userMapChoice input[type="radio"]:checked').value);

            userMapChoice.classList.remove('active');
            userGamemodeChoice.classList.add('active');
            menuStage++;
        }
    });

    confirmGamemodeButton.addEventListener('click', function() {
        if(menuStage === 3){
            const isAnyRadioChecked = Array.from(gamemodeRadios).some(radio => radio.checked);
            if (!isAnyRadioChecked){
                alert('Please select a gamemode before proceeding.');
                return;
            }

            localStorage.setItem('selectedGamemode', document.querySelector('.userGamemodeChoice input[type="radio"]:checked').value);

            userGamemodeChoice.classList.remove('active');
            menuStage == 0;
            window.location.href = '/html/index.html';
        }
    });

    backButton1.addEventListener('click', function() {
        if (menuStage === 1) {
            userPlayerChoice.classList.remove('active');
            buttonsDiv.classList.remove('active');
            menuStage--;
        } 
    });

    backButton2.addEventListener('click', function() {
        if (menuStage === 2) {
            userMapChoice.classList.remove('active');
            userPlayerChoice.classList.add('active');
            menuStage--;
        }
    });

    backButton3.addEventListener('click', function() {
        if (menuStage === 3) {
            userGamemodeChoice.classList.remove('active');
            userMapChoice.classList.add('active');
            menuStage--;
        }
    });
});