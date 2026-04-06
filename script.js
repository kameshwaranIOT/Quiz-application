// Quiz Questions Data
const quizData = [
    {
        id: 1,
        type: 'multiple',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct: 'Paris'
    },
    {
        id: 2,
        type: 'boolean',
        question: 'The Great Wall of China is visible from space with the naked eye.',
        correct: false
    },
    {
        id: 3,
        type: 'multiple',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Saturn', 'Jupiter'],
        correct: 'Mars'
    },
    {
        id: 4,
        type: 'boolean',
        question: 'Python is a type of snake and a programming language.',
        correct: true
    },
    {
        id: 5,
        type: 'multiple',
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
        correct: 'Pacific Ocean'
    },
    {
        id: 6,
        type: 'multiple',
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
        correct: 'Leonardo da Vinci'
    },
    {
        id: 7,
        type: 'boolean',
        question: 'HTML stands for HyperText Markup Language.',
        correct: true
    },
    {
        id: 8,
        type: 'multiple',
        question: 'In what year did the Titanic sink?',
        options: ['1912', '1922', '1932', '1905'],
        correct: '1912'
    }
];

// Quiz State
let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(null);
let quizStarted = false;
let selectedMatching = null;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');

const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', previousQuestion);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Initialize
function startQuiz() {
    quizStarted = true;
    currentQuestion = 0;
    userAnswers = new Array(quizData.length).fill(null);
    showScreen('quiz');
    displayQuestion();
    updateNavigation();
}

function showScreen(screen) {
    startScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultsScreen.classList.remove('active');

    if (screen === 'start') {
        startScreen.classList.add('active');
    } else if (screen === 'quiz') {
        quizScreen.classList.add('active');
    } else if (screen === 'results') {
        resultsScreen.classList.add('active');
    }
}

function displayQuestion() {
    const question = quizData[currentQuestion];
    const questionNumber = currentQuestion + 1;

    // Update header
    document.getElementById('questionNumber').textContent = `Question ${questionNumber} of ${quizData.length}`;
    document.getElementById('questionText').textContent = question.question;

    // Update progress bar
    const progress = (questionNumber / quizData.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Hide all question types
    document.getElementById('multipleChoice').classList.remove('active');
    document.getElementById('trueFalse').classList.remove('active');
    document.getElementById('matching').classList.remove('active');

    // Show appropriate question type
    if (question.type === 'multiple') {
        displayMultipleChoice(question);
    } else if (question.type === 'boolean') {
        displayTrueFalse(question);
    }

    updateNavigation();
}

function displayMultipleChoice(question) {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn btn-option';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(option));

        if (userAnswers[currentQuestion] === option) {
            button.classList.add('selected');
        }

        container.appendChild(button);
    });

    document.getElementById('multipleChoice').classList.add('active');
}

function displayTrueFalse(question) {
    const buttons = document.querySelectorAll('#trueFalse .btn-option');

    buttons.forEach(button => {
        const answer = button.getAttribute('data-answer') === 'true';
        button.classList.remove('selected');

        if (userAnswers[currentQuestion] === answer) {
            button.classList.add('selected');
        }

        button.onclick = () => selectOption(answer);
    });

    document.getElementById('trueFalse').classList.add('active');
}

function selectOption(answer) {
    userAnswers[currentQuestion] = answer;

    // Visual feedback
    const buttons = document.querySelectorAll('.btn-option');
    buttons.forEach(btn => btn.classList.remove('selected'));

    event.target.classList.add('selected');
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        // Quiz complete
        showResults();
    }
}

function updateNavigation() {
    // Previous button
    if (currentQuestion === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // Next button
    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = 'Submit Quiz →';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

function showResults() {
    showScreen('results');

    // Calculate score
    let score = 0;
    quizData.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            score++;
        }
    });

    // Display score
    document.getElementById('finalScore').textContent = score;

    // Display message based on score
    const percentage = (score / quizData.length) * 100;
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect Score! You\'re a Quiz Master!';
    } else if (percentage >= 80) {
        message = '🌟 Excellent work! You really know your stuff!';
    } else if (percentage >= 60) {
        message = '👏 Good job! Keep learning and improving!';
    } else if (percentage >= 40) {
        message = '💪 Not bad! Try again to improve your score!';
    } else {
        message = '📚 Keep studying! You\'ll do better next time!';
    }

    document.getElementById('resultMessage').textContent = message;

    // Display review
    displayReview(score);
}

function displayReview(score) {
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';

    quizData.forEach((question, index) => {
        const reviewItem = document.createElement('div');
        const isCorrect = userAnswers[index] === question.correct;
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;

        let answerText = '';
        if (question.type === 'boolean') {
            answerText = userAnswers[index] ? 'True' : 'False';
        } else {
            answerText = userAnswers[index] || 'Not answered';
        }

        let correctAnswerText = '';
        if (question.type === 'boolean') {
            correctAnswerText = question.correct ? 'True' : 'False';
        } else {
            correctAnswerText = question.correct;
        }

        const status = isCorrect ? '✓' : '✗';

        reviewItem.innerHTML = `
            <strong>${status} Question ${index + 1}</strong>
            <p><strong>Question:</strong> ${question.question}</p>
            <p><strong>Your answer:</strong> ${answerText}</p>
            ${!isCorrect ? `<p><strong>Correct answer:</strong> ${correctAnswerText}</p>` : ''}
        `;

        reviewContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    startQuiz();
    showScreen('quiz');
}

// Start by showing the start screen
showScreen('start');
