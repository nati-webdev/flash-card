import { loadFromStorage, loadThemeFromStorage } from "./storage.js";

const questionInput = document.querySelector('.js-question-input');
const answerInput = document.querySelector('.js-answers-input');
const questionButton = document.querySelector('.js-input-button');
const answerButton = document.querySelector('.js-input-button-answer');
const aiButton = document.querySelector('.js-ai-button');
const darkMode = document.querySelector('.js-dark-mode');
const darkModeIcon = darkMode?.querySelector('span');
const doneButton = document.querySelector('.js-done-button');
const resetButton = document.querySelector('.js-reset-button');
const dataContainer = document.querySelector('.js-data-container');
const expandButton = document.querySelector('.js-expand');
const listBackdrop = document.querySelector('.js-list-backdrop');

const savedTheme = loadThemeFromStorage();
let Data = loadFromStorage();

let questions = '';
let answer = '';

if(savedTheme === 'true'){
  document.body.classList.add('dark-mode');
  if(darkModeIcon) darkModeIcon.textContent = '☀️';
}

if(darkMode){
    const isDark = document.body.classList.contains('dark-mode');
    darkMode.setAttribute('aria-pressed', String(isDark));
  darkMode.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    darkMode.setAttribute('aria-pressed', String(isDark));
    if(darkModeIcon) darkModeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('dark',  String(isDark));
  });
}
if(questionInput && questionButton) {
  questionInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      questionButton.click();
    }
  });
}
if(questionButton){
  questionButton.addEventListener('click', () => {
    const Getquestion = questionInput.value;
    if(Getquestion !== ''){
    document.querySelector('.question-container').classList.toggle('is-open');
    document.querySelector('.answers-container').classList.toggle('is-open');
    questions = Getquestion;
    questionInput.value = '';
    }
    

  })
}
if(answerButton){
answerButton.addEventListener('click', () => {
  const Getanswer = answerInput.value;
  answer = Getanswer;
  Data.push({
    question: questions,
    answer: answer
  })
  saveTostorage();
  displayData();
  document.querySelector('.question-container').classList.toggle('is-open');
  document.querySelector('.answers-container').classList.toggle('is-open');
  answerInput.value ='';
  questions = '';

});
}
if(aiButton){
  aiButton.addEventListener('click', async () => {
  if(questions === ''){
    alert('type a question first.');
    return;
  }
    const question = questions;
    const originalContent = aiButton.innerHTML;
    aiButton.textContent = 'Generating...';
    aiButton.disabled = true;

    try {
    const response = await fetch('https://nati-flashcard-backend.onrender.com/api/generate-answer',
       {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: question
      })
    });
   const data = await response.json();

   if(!response.ok) {
    alert(data.error || 'The server returned an error.');
    return;
   }
  answerInput.value = data.answer;
  } catch (error) {
    console.error(error);
    alert('Could not connect to the AI service. Check your internet connection and try again.');
  } finally {
    aiButton.innerHTML = originalContent;
    aiButton.disabled = false;
  }
});
}

if(doneButton){
doneButton.addEventListener('click', () => {
  window.location.href = 'testing.html';
});
}

if(resetButton){
  resetButton.addEventListener('click', () => {
    localStorage.removeItem('data');
    Data = [];
    displayData();
  });
}




if(dataContainer){
  dataContainer.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.link-button');
    if(!deleteButton) return;
    
    const index = Number(deleteButton.dataset.index);
    Data.splice(index, 1);
    saveTostorage();
    displayData();
  });
}

function saveTostorage() {
  localStorage.setItem('data', JSON.stringify(Data));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function displayData() {
  if(!dataContainer) return;


  if(Data.length === 0) {
  dataContainer.innerHTML = `<p class="empty-message">
           No cards yet. Add one to get started.</p>`;
           if(expandButton) {
            expandButton.hidden = true;
            setListExpanded(false);
           }
           return;
 }

  dataContainer.innerHTML = Data.map((item, index) => `
      <div class="inbox-card">
            <strong>${index+1}. ${escapeHTML(item.question)}
            </strong>
              <p>${escapeHTML(item.answer)}</p>
                <button type="button" class="link-button" data-index="${index}">
                  Delete</button>
       </div>
  `).join('');

  if(expandButton){
    expandButton.hidden = Data.length <1;
    if(expandButton.hidden){
      dataContainer.classList.remove('expanded');
      expandButton.textContent = 'Expand';
    }
  }
}

if(expandButton && dataContainer ){
  expandButton.addEventListener('click', () => {
    setListExpanded(!dataContainer.classList.contains('expanded'));
  });
}

if(listBackdrop) {
  listBackdrop.addEventListener('click', () => setListExpanded(false));
}

function setListExpanded(isExpanded) {
  dataContainer.classList.toggle('expanded', isExpanded);
  document.body.classList.toggle('list-open', isExpanded);
  expandButton.textContent = isExpanded ? 'Show less' : 'Expand';
  expandButton.setAttribute('aria-expanded', String(isExpanded));
  if(listBackdrop) listBackdrop.hidden = !isExpanded;
}

displayData();
