var screen = document.querySelector('#screen');
    var btn = document.querySelectorAll('.btn');

    // For clicking buttons
    for (item of btn) {
        item.addEventListener('click', (e) => {
            let btntext = e.target.innerText;

            if (btntext == '×') btntext = '*';
            if (btntext == '÷') btntext = '/';

            screen.value += btntext;
        });
    }

    function calculate() {
        try {
            screen.value = eval(screen.value);
        } catch (err) {
            alert("Invalid Input");
            clearScreen();
        }
    }

    function clearScreen() {
        screen.value = '';
    }

    function sin() {
        screen.value = Math.sin(toRadians(screen.value));
    }

    function cos() {
        screen.value = Math.cos(toRadians(screen.value));
    }

    function tan() {
        screen.value = Math.tan(toRadians(screen.value));
    }

    function sqrt() {
        if (screen.value) screen.value = Math.sqrt(screen.value);
    }

    function log() {
        if (screen.value) screen.value = Math.log10(screen.value);
    }

    function pi() {
        screen.value += Math.PI.toFixed(10);
    }

    function e() {
        screen.value += Math.E.toFixed(10);
    }

    function pow() {
        let base = parseFloat(prompt("Enter base:"));
        let exponent = parseFloat(prompt("Enter exponent:"));
        screen.value = Math.pow(base, exponent);
    }

    function fact() {
        let num = parseInt(screen.value);
        if (num < 0) {
            alert("Factorial of negative numbers is not defined");
            return;
        }
        screen.value = factorial(num);
    }

    function backspc() {
        screen.value = screen.value.slice(0, -1);
    }

    function percent() {
        screen.value = eval(screen.value) / 100;
    }

    function toRadians(angle) {
        return (angle * Math.PI) / 180;
    }

    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }