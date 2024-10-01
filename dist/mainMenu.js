document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mapChoice');
    const radios = document.getElementsByName('map');
    const submitButton = document.getElementById('startGame');
    const gamemodeRadios = document.getElementsByName('gamemode');
    const gamemodeForm = document.getElementById('gamemodeChoice');

    submitButton.addEventListener('click', function(event) {
        let isMapChecked = false;
        let isGamemodeChecked = false;

        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                isMapChecked = true;
                localStorage.setItem('selectedMap', radios[i].value);
                break;
            }
        }

        for (let i = 0; i < gamemodeRadios.length; i++) {
            if (gamemodeRadios[i].checked) {
                isGamemodeChecked = true;
                localStorage.setItem('selectedGamemode', gamemodeRadios[i].value);
                break;
            }
        }

        if (!isMapChecked || !isGamemodeChecked) {
            event.preventDefault();
            alert('Please select both a map and a gamemode before submitting.');
        } else {
            window.location.href = 'src/public/index.html';
        }
    });
});