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

const highscoreLocalStorage = JSON.parse(localStorage.getItem('highscores')) || [];

endGameContainerEl.style.display = 'none';
goBackBtnEl.style.display = 'none';
clearHighscoreBtnEl.style.display = 'none';


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
    endGameContainerEl.style.display = 'block';
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

    questionContainerEl.innerHTML = questions[questionIndex].question;
    answerContainerEl.innerHTML = '';
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
    highscoreContainerEl.innerHTML = '';
    const highscoreListEl = document.createElement('ol');
    
    if (highscoreLocalStorage.length < 1) {
        const NoHighscoreEL = document.createElement('h1')
        NoHighscoreEL.textContent = 'No highscores yet!';
        highscoreContainerEl.appendChild(NoHighscoreEL);
    } else { 
        highscoreLocalStorage.map(highscore => {
        const highscoreEl = document.createElement('li');
        highscoreEl.textContent = `${highscore.initials} - ${highscore.score}`;
        highscoreListEl.appendChild(highscoreEl);
        highscoreContainerEl.appendChild(highscoreListEl);
        });
    }
}

viewHighscoreEl.addEventListener('click', () => {
    initialContainerEl.style.display = 'none';
    questionContainerEl.innerHTML = '';
    answerContainerEl.innerHTML = '';
    viewHighscoreEl.style.display = 'none';
    displayHighscore();
});

submitBtnEl.addEventListener('click', () => {
    const initials = initialsInputEl.value;
    const highscore = {
        initials: initials,
        score: timeLeft + score,
    };
    highscoreLocalStorage.push(highscore);
    highscoreLocalStorage.sort((a, b) => b.score - a.score);
    localStorage.setItem('highscores', JSON.stringify(highscoreLocalStorage));
    endGameContainerEl.style.display = 'none';
});



startBtnEl.addEventListener('click', startQuiz);

goBackBtnEl.addEventListener('click', () => {
    location.reload();
});
