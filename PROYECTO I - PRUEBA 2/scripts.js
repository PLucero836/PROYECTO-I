const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score-board');
const winMessage = document.getElementById('win-message');
const timerDisplay = document.getElementById('timer');
const levels = {
    1: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E','I','I'],
    2: ['FA','FA','GB', 'GB', 'HI', 'HI', 'IA', 'IA', 'JK', 'JK', 'KQ', 'KQ', 'LS', 'LS','DO','DO'],
    3: ['MES', 'MES', 'NIL', 'NIL', 'SOL', 'SOL', 'PQE', 'PQE', 'QES', 'QES', 'RST', 'RST', 'SAZ', 'SAZ', 'TGF', 'TGF']
};
const levelTimes = {
    1: 60,
    2: 90,
    3: 120
};
let currentLevel = 1;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let matchedPairs = 0;
let timer;

function startTimer() {
    let timeLeft = levelTimes[currentLevel];
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            winMessage.innerText = '¡Se acabó el tiempo!';
            winMessage.style.display = 'block';
        }
        timerDisplay.innerText = `Tiempo: ${timeLeft} s`;
    }, 1000);
}

function createBoard() {
    shuffle(levels[currentLevel]);
    gameBoard.innerHTML = '';
    levels[currentLevel].forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${value}</div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.querySelector('.back').innerHTML === secondCard.querySelector('.back').innerHTML;

    if (isMatch) {
        disableCards();
        updateScore();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    if (matchedPairs === levels[currentLevel].length / 2) {
        if (currentLevel === 3) {
            showWinMessage();
        } else {
            goToNextLevel();
        }
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 400);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function updateScore() {
    score++;
    scoreDisplay.innerText = `Puntuación: ${score}`;
}

function showWinMessage() {
    winMessage.innerText = '¡Has ganado!';
    winMessage.style.display = 'block';
}

function goToNextLevel() {
    currentLevel++;
    matchedPairs = 0;
    winMessage.style.display = 'none';
    score = 0;
    scoreDisplay.innerText = `Puntuación: ${score}`;
    clearInterval(timer);
    timerDisplay.innerText = '';
    createBoard();
    startTimer();
}

createBoard();
startTimer();
