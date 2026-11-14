import { loadFromStorage, loadThemeFromStorage } from "./storage.js";

let data = loadFromStorage();
console.log(data);
const skipButton = document.querySelector('.js-skip');
const revealButton = document.querySelector('.js-reveal');
const returnButton = document.querySelector('.js-return');
const flashCard = document.querySelector('.js-flash-card');
const flashCardAnswer = document.querySelector('.js-flash-card-answer');
const addQuestion = document.querySelector('.js-add');
const darkMode = document.querySelector('.js-dark-mode');
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
    darkMode.textContent = '☀️';
    }


  darkMode.addEventListener('click', () => {
    DarkMode.classList.toggle('dark-mode');
    
    if(darkMode.textContent === '☀️'){
    darkMode.textContent = '🌙';
    }else{
      darkMode.textContent = '☀️';
    }
    localStorage.setItem('dark',  DarkMode.classList.contains('dark-mode'));
  });
}
 
if(data && data.length > 0) {
  if(flashCard){
    flashCard.innerHTML = `${data[currentQuestionIndex].question}`;
  }
  function setAnswerVisible(isVisible) {
    flashCard.classList.toggle('is-open', isVisible);
    flashCardAnswer.classList.toggle('is-open', isVisible);
    revealButton.textContent = isVisible ? 'Hide answer' : 'Reveal';
    revealButton.setAttribute('aria-expanded', String(isVisible));
  }

  if(revealButton){
    revealButton.addEventListener('click', () => {
      const isAnswerVisible = flashCardAnswer.classList.contains('is-open');
      if (isAnswerVisible) {
        setAnswerVisible(false);
      } else {
        flashCardAnswer.innerHTML = `${data[currentQuestionIndex]?.answer}`;
        animateCard(flashCardAnswer);
        if (!revealedQuestions.has(currentQuestionIndex)) {
          revealedQuestions.add(currentQuestionIndex);
          if (revealedCount) {
            revealedCount.textContent = `${revealedQuestions.size}/${data.length}`;
          }
        }
        setAnswerVisible(true);
      }
      recordStudyDay();
    });
  }
  if(skipButton){
    skipButton.addEventListener('click', () => {
      if(currentQuestionIndex >= data.length - 1){
        flashCard.innerHTML ='You reached the end. Add some topics to study';
        progressBar.style.width = '100%';
        return;
      }else if(currentQuestionIndex < data.length - 1){
        currentQuestionIndex ++;
        progress = calculateProgress();
        count = currentQuestionIndex + 1;
        Percentage = PERCENTAGE();
      }
      setAnswerVisible(false);
      flashCard.innerHTML = `${data[currentQuestionIndex]?.question}`;
      animateCard(flashCard);
      progressBar.style.width = progress;
      cardCount.innerHTML = cardCounts(count);
      percentage.innerHTML = `${Percentage}% completed`;
    });
  }
  if(returnButton) {
    returnButton.addEventListener('click', () => {
      if(currentQuestionIndex >0){
      currentQuestionIndex--;
      count = currentQuestionIndex + 1;
      Percentage = PERCENTAGE();

      if(currentQuestionIndex === 0){
        progress = `2%`;
      }else{
        progress = calculateProgress();
      }
      }
        setAnswerVisible(false);
        flashCard.innerHTML = `${data[currentQuestionIndex]?.question}`;
        animateCard(flashCard);
        cardCount.innerHTML = cardCounts(count);
        progressBar.style.width = progress;
        percentage.innerHTML = `${Percentage}% completed`;
    });
  }
  function calculateProgress(){
    const RawProgress = (currentQuestionIndex / (data.length-1)) * 100;
    const result = RawProgress.toFixed(0);
    const Progress = `${result}%`;
    return Progress;
  }

  function cardCounts(count){
    const CardCount = `${count}/${data.length}`;
    return CardCount;
  }

  function PERCENTAGE() {
    const Rawpercentage = (currentQuestionIndex / (data.length - 1)) * 100;
    const percentage = Rawpercentage.toFixed(0);
    return percentage;
  }
}else{
  if(flashCard){
  flashCard.innerHTML ='Add some topics to study';
  }
}
if(addQuestion){
    addQuestion.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }