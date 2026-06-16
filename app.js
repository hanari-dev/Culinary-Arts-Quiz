/* =============================================================
   PART A: QUIZ DATA - Culinary Arts
   ============================================================= */
const questions = [
  {
    question: "What is the French term for 'everything in its place'?",
    options: ["Mise en place", "Sauté", "Sous vide", "Julienne"],
    correctAnswer: "Mise en place"
  },
  {
    question: "Which rice is the gold standard for Italian risotto?",
    options: ["Basmati", "Jasmine", "Arborio", "Sushi rice"],
    correctAnswer: "Arborio"
  },
  {
    question: "What technique involves boiling a vegetable then cooling it in ice?",
    options: ["Caramelizing", "Blanching", "Poaching", "Braising"],
    correctAnswer: "Blanching"
  },
  {
    question: "What is the mixture of flour and fat used to thicken sauces?",
    options: ["Coulis", "Reduction", "Roux", "Emulsion"],
    correctAnswer: "Roux"
  },
  {
    question: "Which method involves cooking vacuum-sealed food in a water bath?",
    options: ["Sous vide", "Smoking", "Deep frying", "Grilling"],
    correctAnswer: "Sous vide"
  }
];

/* --- Bonus: Shuffle Function --- */
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

/* =============================================================
   PART B: YOUR LOGIC FUNCTIONS
   Write the body of each function below.
   ============================================================= */

/*
 * checkAnswer(selected, correct)
 * ─────────────────────────────
 * Receives two strings — the answer the user picked and the
 * correct answer from the question object.
 * Should return true if they match, false if they don't.
 */
function checkAnswer(selected, correct) {
  return selected === correct;
}

/*
 * calculateScore(results)
 * ───────────────────────
 * Receives the results array — an array of true/false values,
 * one entry per question answered so far.
 * Should return how many of those values are true (correct answers).
 */
function calculateScore(results) {
  return results.filter(result => result === true).length;
}

/*
 * getGrade(score, total)
 * ──────────────────────
 * Receives the number of correct answers and the total questions.
 * Should calculate the percentage and return a letter grade:
 *   90% and above → 'A'
 *   80% and above → 'B'
 *   70% and above → 'C'
 *   60% and above → 'D'
 *   Below 60%     → 'F'
 */
function getGrade(score, total) {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

/* =============================================================
   PART C: DOM INTERACTION
   ─────────────────────────────────────────────────────
   The elements below are already selected for you using
   document.getElementById(). Each variable name matches an
   id in index.html — open that file to see what each one is.
   ============================================================= */

/* --- App State --- */
let currentIndex = 0;     // tracks which question we're on
let results = [];    // stores true/false per answered question
let answered = false; // prevents clicking more than once per question

/* --- Element References (already done ✅) --- */
const quizCard = document.getElementById('quizCard');
const resultsCard = document.getElementById('resultsCard');
const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const scoreBadge = document.getElementById('scoreBadge');
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const feedbackBox = document.getElementById('feedbackBox');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const resultsEmoji = document.getElementById('resultsEmoji');
const resultsTitle = document.getElementById('resultsTitle');
const resultsSubtitle = document.getElementById('resultsSubtitle');
const scoreDisplay = document.getElementById('scoreDisplay');
const gradeDisplay = document.getElementById('gradeDisplay');
const correctCount = document.getElementById('correctCount');
const wrongCount = document.getElementById('wrongCount');
const percentDisplay = document.getElementById('percentDisplay');

const LETTERS = ['A', 'B', 'C', 'D']; // used for the A B C D badges on buttons

/*
 * renderQuestion()
 * ────────────────
 * Reads the current question from the array (use currentIndex)
 * and updates the page to show it.
 *
 * This function needs to:
 *   1. Update the progress bar, question counter, and score badge
 *   2. Set the question text on the page
 *   3. Clear the options grid, then create one button per option
 *      — each button needs the letter badge, the option text,
 *        and a click event listener that calls handleOptionClick()
 *   4. Hide the feedback box and the Next button
 *
 * NOTE: When creating buttons, use document.createTextNode() to
 * add the option text — do NOT use innerHTML. Some answers contain
 * HTML tags like "<h1>" that would be parsed as real HTML otherwise.
 */
function renderQuestion() {
  const q = questions[currentIndex];
  answered = false;

  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  scoreBadge.textContent = `Score: ${calculateScore(results)}`;
  progressBar.style.width = `${(currentIndex / questions.length) * 100}%`;
  questionText.textContent = q.question;
  
  optionsGrid.innerHTML = '';
  feedbackBox.className = 'feedback-box';
  feedbackBox.style.display = 'none';
  nextBtn.style.display = 'none';

  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${LETTERS[i]}</span>`;
    btn.appendChild(document.createTextNode(option));
    btn.addEventListener('click', () => handleOptionClick(option, btn));
    optionsGrid.appendChild(btn);
  });
}

/*
 * handleOptionClick(selected, clickedBtn)
 * ───────────────────────────────────────
 * Called when the user clicks an answer button.
 *
 * This function needs to:
 *   1. Do nothing if the question has already been answered
 *   2. Check whether the selected answer is correct
 *   3. Record the result (push true or false into results)
 *   4. Disable all buttons so the user can't change their answer
 *   5. Add the 'correct' or 'wrong' CSS class to the clicked button
 *      (if wrong, also highlight which button was the correct answer)
 *   6. Show a feedback message telling the user if they were right or wrong
 *   7. Reveal the Next button (change its text to "See Results →" on the last question)
 */
function handleOptionClick(selected, clickedBtn) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const isCorrect = checkAnswer(selected, q.correctAnswer);
  results.push(isCorrect);

  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

  if (isCorrect) {
    clickedBtn.classList.add('correct');
    feedbackBox.textContent = "Correct!";
    feedbackBox.className = "feedback-box show correct";
  } else {
    clickedBtn.classList.add('wrong');
    feedbackBox.textContent = `Wrong. The correct answer was: ${q.correctAnswer}`;
    feedbackBox.className = "feedback-box show wrong";
    
    Array.from(optionsGrid.children).forEach(btn => {
      if (btn.textContent.includes(q.correctAnswer)) btn.classList.add('correct');
    });
  }

  nextBtn.style.display = 'block';
  if (currentIndex === questions.length - 1) nextBtn.textContent = "See Results →";
}

/*
 * showResults()
 * ─────────────
 * Called after the user answers the last question.
 *
 * This function needs to:
 *   1. Calculate the final score, percentage, and letter grade
 *   2. Fill in all the results screen elements
 *      (score, grade badge, correct count, wrong count, percentage)
 *   3. Hide the quiz card and reveal the results card
 */
function showResults() {
  const score = calculateScore(results);
  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  /* --- Bonus: High Score Logic --- */
  const savedHighScore = localStorage.getItem('quizHighScore') || 0;
  if (score > savedHighScore) {
    localStorage.setItem('quizHighScore', score);
  }

  quizCard.style.display = 'none';
  resultsCard.classList.add('show');
  
  scoreDisplay.innerHTML = `${score}<span>/${total}</span>`;
  gradeDisplay.textContent = getGrade(score, total);
  correctCount.textContent = score;
  wrongCount.textContent = total - score;
  percentDisplay.textContent = `${percent}%`;
  resultsSubtitle.textContent = `Your High Score: ${localStorage.getItem('quizHighScore')}`;
}


/*
 * restartQuiz()
 * ─────────────
 * Called when the user clicks "Try Again".
 *
 * This function needs to:
 *   1. Reset currentIndex, results, and answered back to their starting values
 *   2. Hide the results card and show the quiz card again
 *   3. Call renderQuestion() to start from the first question
 */
function restartQuiz() {
  currentIndex = 0;
  results = [];
  shuffleQuestions(); // Shuffle again on restart
  quizCard.style.display = 'block';
  resultsCard.classList.remove('show');
  renderQuestion();
}

/* =============================================================
   EVENT LISTENERS — ALREADY DONE FOR YOU ✅
   You do not need to change anything here.
   ============================================================= */

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

restartBtn.addEventListener('click', restartQuiz);

/* =============================================================
   INIT — runs renderQuestion() when the page first loads
   ============================================================= */
renderQuestion();
