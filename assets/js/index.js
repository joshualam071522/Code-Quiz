const timeEl= document.getElementById('time');
const timeIntegerEl = document.getElementById('time-integer');
const startBtnEl = document.getElementById('start');
const questionContainerEl = document.getElementById('question-container');
const answerContainerEl = document.getElementById('answer-container');
const initialContainerEl = document.getElementById('initial-container');
const highscoreContainerEl = document.getElementById('highscore-container');
const viewHighscoreEl = document.getElementById('view-highscore');
const clearHighscoreContainerEl = document.getElementById('clear-highscore-container');
const goBackBtnEl = document.getElementById('go-back');
const clearHighscoreBtnEl = document.getElementById('clear-highscore');
const endGameContainerEl = document.getElementById('end-game-container');
const initialsInputEl = document.getElementById('initials');
const submitBtnEl = document.getElementById('submit');
const finalScoreEl = document.getElementById('final-score');

const highscoreLocalStorage = JSON.parse(localStorage.getItem('highscores')) || [];

endGameContainerEl.classList.add('d-none');
goBackBtnEl.classList.add('d-none');
clearHighscoreBtnEl.classList.add('d-none');


let score = 0;
let timeLeft = 30;
timeIntegerEl.textContent = timeLeft;

let questionIndex = 0;

const questions = [
    {
        question: "Commonly used data types DO NOT include:",
        answers: [
            { text: "strings", correct: false },
            { text: "booleans", correct: false },
            { text: "alerts", correct: true },
            { text: "numbers", correct: false }
        ]
    },
    {
        question: "The condition in an if / else statement is enclosed within ____.",
        answers: [
            { text: "quotes", correct: false },
            { text: "curly brackets", correct: false },
            { text: "parentheses", correct: true },
            { text: "square brackets", correct: false }
        ]
    },
    {
        question: "Arrays in JavaScript can be used to store ____.",
        answers: [
            { text: "numbers and strings", correct: false },
            { text: "other arrays", correct: false },
            { text: "booleans", correct: false },
            { text: "all of the above", correct: true }
        ]
    },
    {
        question: "String values must be enclosed within ____ when being assigned to variables.",
        answers: [
            { text: "commas", correct: false },
            { text: "curly brackets", correct: false },
            { text: "quotes", correct: true },
            { text: "parentheses", correct: false }
        ]
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: [
            { text: "JavaScript", correct: false },
            { text: "terminal / bash", correct: false },
            { text: "for loops", correct: false },
            { text: "console.log", correct: true }
        ]
    }
];


const endQuiz = () => {
    questionContainerEl.innerHTML = '';
    answerContainerEl.innerHTML = '';
    endGameContainerEl.classList.remove('d-none');
    endGameContainerEl.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');

    if (timeLeft + score < 0) {
        finalScoreEl.textContent = 0;
    } else {
        finalScoreEl.textContent = timeLeft + score;
    }
}

const selectAnswer = (e) => {
    const selectedBtn = e.target;
    const correct = selectedBtn.dataset.correct;
    if (correct) {
        ++score;
    } else {
        timeLeft -= 5;
    }
    questionIndex++;
    if (questionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

const displayQuestion = () => {
    questionContainerEl.classList.remove('d-none');
    questionContainerEl.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
    questionContainerEl.innerHTML = questions[questionIndex].question;
    answerContainerEl.innerHTML = '';
    answerContainerEl.classList.remove('d-none');
    answerContainerEl.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
    const answers = questions[questionIndex].answers;
    answers.map(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'btn-primary', 'p-3', 'm-3', 'w-25', 'text-left', 'btn-lg');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerContainerEl.appendChild(button);
    });
}

const startQuiz = () => {
    questionIndex = 0;
    initialContainerEl.style.display = 'none';
    displayQuestion();
    const timer = setInterval(() => {
        timeLeft--;
        timeIntegerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        } else if (questionIndex >= questions.length) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}
const displayHighscore = () => {
    questionContainerEl.innerHTML = '';
    answerContainerEl.innerHTML = '';
    viewHighscoreEl.style.display = 'none';
    initialContainerEl.style.display = 'none';
    timeEl.style.display = 'none';
    endGameContainerEl.classList.add('d-none');
    viewHighscoreEl.style.display = 'none';
    goBackBtnEl.classList.remove('d-none');
    clearHighscoreBtnEl.classList.remove('d-none');

    highscoreContainerEl.innerHTML = '';

    const highscoreListEl = document.createElement('ol');
    
    if (highscoreLocalStorage.length < 1) {
        const NoHighscoreEL = document.createElement('h1')
        NoHighscoreEL.textContent = 'No highscores yet!';
        highscoreContainerEl.appendChild(NoHighscoreEL);
    } else {
        const highscoreTitleEl = document.createElement('h1');
        highscoreTitleEl.classList.add('pb-5');
        highscoreTitleEl.textContent = 'Highscores';
        highscoreContainerEl.appendChild(highscoreTitleEl);
        highscoreLocalStorage.map(highscore => {
        const highscoreEl = document.createElement('li');
        highscoreEl.classList.add('pb-3');
        highscoreEl.textContent = `${highscore.initials} -- ${highscore.score} pts`;
        highscoreListEl.appendChild(highscoreEl);
        highscoreContainerEl.appendChild(highscoreListEl);
        });
    }
}

viewHighscoreEl.addEventListener('click', () => {
    displayHighscore();
});

submitBtnEl.addEventListener('click', (e) => {
    e.preventDefault();
    const initials = initialsInputEl.value;
    const highscore = {
        initials: initials,
        score: finalScoreEl.textContent,
    };
    highscoreLocalStorage.push(highscore);
    highscoreLocalStorage.sort((a, b) => b.score - a.score);
    localStorage.setItem('highscores', JSON.stringify(highscoreLocalStorage));
    endGameContainerEl.style.display = 'none';
    displayHighscore();
});



startBtnEl.addEventListener('click', startQuiz);

goBackBtnEl.addEventListener('click', () => {
    location.reload();
});

clearHighscoreBtnEl.addEventListener('click', () => {
    localStorage.setItem('highscores', JSON.stringify([]));
    displayHighscore();
    location.reload();
});