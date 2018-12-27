const buttons = document.querySelectorAll('[data-time]');

const timer = (function(){
    let countdown;
    const timerDisplay = document.querySelector('.display__time-left');
    const endTimeDisplay = document.querySelector('.display__end-time');

    function displayTimeLeft(seconds) {
        const convertToHours = (function convertToHours(minutes){  
            let hours = 0;
            return function findMultiple() {
                if (minutes >= 60) {
                    hours++;
                    minutes -= 60;
                    return findMultiple(minutes);
                } 
                return ({hours, minutes, seconds: seconds % 60});
            }
        })(Math.floor(seconds / 60));

        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const hourFormat = convertToHours(seconds);
        const timeIsMoreThan1Hour = seconds >= 3600 ? true: false;
        const display = timeIsMoreThan1Hour ? 
        `${padTime(hourFormat.hours)}:${padTime(hourFormat.minutes)}:${padTime(hourFormat.seconds)}` :
        `${padTime(minutes)}:${padTime(remainderSeconds)}`;
        timerDisplay.textContent = display;
        document.title = display;
    }

    function displayReturnTime(timestamp) {
        const returnTime = new Date(timestamp);
        const hour = returnTime.getHours();
        const adjustedHour = hour > 12 ? hour - 12 : hour;
        const minutes = returnTime.getMinutes();
        endTimeDisplay.textContent = `Be back at ${String(adjustedHour)}:${padTime(minutes)}`;
    }

    function padTime(time) {
        return String(time).padStart(2, '0');
    }
    
    function initiateCountdown (seconds=10) {
        countdown && clearInterval(countdown);
        const now = Date.now();
        const returnTime = now + seconds * 1000;
        displayTimeLeft(seconds);
        displayReturnTime(returnTime);

        countdown = setInterval(() => {
            const secondsLeft = Math.round((returnTime - Date.now()) / 1000);
            if (secondsLeft < 0) {
                clearInterval(countdown);
                return;
            }
            displayTimeLeft(secondsLeft);        
        }, 1000);
    };

    return {
        startTimer(event, timeProvided) {
            const seconds = timeProvided || parseInt(event.target.dataset.time);
            initiateCountdown(seconds);
        }
    }
})();

buttons.forEach(button => button.addEventListener('click', timer.startTimer));
document.customForm.addEventListener('submit', function(e){ 
    e.preventDefault();
    const mins = this.minutes.value;
    timer.startTimer(null, mins * 60);
    this.reset();
});

