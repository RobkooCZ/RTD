document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mapChoice');
    const radios = document.getElementsByName('map');
    const submitButton = document.getElementById('startGame');

    submitButton.addEventListener('click', function(event) {
        let isChecked = false;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                isChecked = true;
                localStorage.setItem('selectedMap', radios[i].value);
                window.location.href = 'src/public/index.html';
                break;
            }
        }

        if (!isChecked) {
            event.preventDefault();
            alert('Please select an option before submitting.');
        }
    });
});