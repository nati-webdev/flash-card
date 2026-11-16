import { loadFromStorage, loadThemeFromStorage } from "./storage.js";

let data = loadFromStorage();
const skipButton = document.querySelector('.js-skip');
const revealButton = document.querySelector('.js-reveal');
const returnButton = document.querySelector('.js-return');
const flashCard = document.querySelector('.js-flash-card');
const flashCardAnswer = document.querySelector('.js-flash-card-answer');
const addQuestion = document.querySelector('.js-add');
const darkMode = document.querySelector('.js-dark-mode');
const darkModeIcon = darkMode?.querySelector('span');
const DarkMode = document.querySelector('.testing-page');
const progressBar = document.querySelector('.progress-bar');
const percentage = document.querySelector('.js-percentage');
const cardCount = document.querySelector('.js-card-count');
const revealedCount = document.querySelector('.js-revealed-count');
const streakDisplay = document.querySelector('#study-streak');

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function updateStreakDisplay() {
  const stats = JSON.parse(localStorage.getItem('studyStats') || '{}');
  const streak = stats.streak || 0;

  if (streakDisplay) {
    streakDisplay.textContent =
      `Study streak: ${streak} ${streak === 1 ? 'day' : 'days'}`;
  }
}

function animateCard(card) {
  if (!card) return;

  card.classList.remove('card-enter');
  void card.offsetWidth;
  card.classList.add('card-enter');
}

function recordStudyDay() {
  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = getLocalDateKey(yesterday);
  const stats = JSON.parse(localStorage.getItem('studyStats') || '{}');

  // A reveal later today shouldn't increase today's streak again.
  if (stats.lastStudyDate === todayKey) {
    return;
  }

  stats.streak = stats.lastStudyDate === yesterdayKey
    ? (stats.streak || 0) + 1
    : 1;

  stats.lastStudyDate = todayKey;
  localStorage.setItem('studyStats', JSON.stringify(stats));
  updateStreakDisplay();
}

updateStreakDisplay();
let currentQuestionIndex  = 0;
let progress = '';
let count = 0;
let Percentage = 0;
const revealedQuestions = new Set();
const savedTheme = loadThemeFromStorage();
if (percentage) {
percentage.innerHTML = `0% completed`;
}
if(cardCount){
cardCount.innerHTML = `1/${data.length}`;
}
if (revealedCount) {
  revealedCount.textContent = `0/${data.length}`;
}

if(DarkMode && darkMode){
  if(savedTheme === 'true') {
    DarkMode.classList.add('dark-mode');
    if(darkModeIcon) darkModeIcon.textContent = '☀️';
    }

  darkMode.setAttribute('aria-pressed', String(DarkMode.classList.contains('dark-mode')));
  darkMode.addEventListener('click', () => {
    DarkMode.classList.toggle('dark-mode');

    const isDark = DarkMode.classList.contains('dark-mode');
    darkMode.setAttribute('aria-pressed', String(isDark));
    if(darkModeIcon) darkModeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('dark', String(isDark));
  });
