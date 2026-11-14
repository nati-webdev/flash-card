import { loadFromStorage, loadThemeFromStorage } from "./storage.js";

const questionInput = document.querySelector('.js-question-input');
const answerInput = document.querySelector('.js-answers-input');
const questionButton = document.querySelector('.js-input-button');
const answerButton = document.querySelector('.js-input-button-answer');
const aiButton = document.querySelector('.js-ai-button');
const darkMode = document.querySelector('.js-dark-mode');
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
  darkMode.textContent = '☀️';
}

if(darkMode){
    const isDark = document.body.classList.contains('dark-mode');
    darkMode.setAttribute('aria-pressed', String(isDark));
  darkMode.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    darkMode.setAttribute('aria-pressed', String(isDark));


    if(darkMode.textContent === '☀️'){
    darkMode.textContent = '🌙';
    }else{
      darkMode.textContent = '☀️';
    }
    localStorage.setItem('dark',  String(isDark));
  });
}
if(questionButton) {
  questionButton.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
      const Getquestion = questionInput.value;
    if(Getquestion !== ''){
    document.querySelector('.question-container').classList.toggle('is-open');
    document.querySelector('.answers-container').classList.toggle('is-open');
    questions = Getquestion;
    questionInput.value = '';
    }
    }
  })
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
    answerInput.value = 'not working';
  } finally {
    aiButton.textContent = `<img class="ai-image" src="data:image/png;base64,
            iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAA
            LEwEAmpwYAAADRklEQVR4nO2YzWsTQRjGp+1BDx6sqAfRZmYbC6IIgiCoVPFQwY
            qKkJmi0IP9AzxJLHR3PZZWhNDMxOJBEPHQi9WbgrQzKfhxEz+g6FEtCtpmJkkV26
            xMaULJVzdNNtlgf/DCspmdPM/MvO++LACbbOIPDKbOICq/ISa/BmLqNGgqHKcFMj
            WLmHJ06Gt9DzQLkCXPZsXnTNBkD2gWEFVP8g0gph6DZsAYT3cgKpcKDFC5BKPpAPA
            7iMnRIqu/akKNAD+zbyy1B1GZKmmAyXQwktoL/Apiary0+FzEgB+BNNlT9OwX7sKy
            QRO9wE8YscR+xNS8i9XPxq/O6EIQ+AE0luiCVH2uQHz25fZJG2+oeCMmT0CmflQqfk1
            V+tmQNmPvvYUdiKlhSOWfDYvP7YT8q5PfYGq358I72EI7onJQn+FqhRfLC0TloP4PL4
            QbiMoIYirpgfD8N/YiovJBgMoDtaouk7r0eS68SLlFTE1WVa0gk2/qL1zlx6uNG6Dye
            +MNyLlqdiCMqMw0TDyVGcgSN0DVeaATuGyTVtuATP7WiWwwdQjUimBE7lrdkS+eCacrR3
            ZYd7XAKwL3na16WyvsfdaLeT1nMOJsAfWia1zuhEw+qsGqP9RzgUYBqbq+ofeELg5U3f
            LF1wpE5UDlq5+4BvwEZPKOe/FyFPiOCacNUjWz/plXQo91M2UoNNFmET5jYSFs22n13EO
            AJY+UzQcqM8bd1FG389l90xcsIhwdNhHnQT0oV5n0b+5nclpMwl9mDZhEvNb3gNd0RtXB
            ku0HVYfdzmMRPpAVn40hHO8H9QBS+bxI4j5z+7xN+HETi8V8AxbhabNPHPNWve6faKI33
            4ARS55z86yF+VUttFB89ijx1BAWfd46sJ3Wgs/r61QRMyROmZhPlRJeYASLFzbm3Z55gF
            HZjaj6AJl8b0TlyXJjLcKfuhVu5QcWk6DRmJjPVmHgY6P1g5tX4u0WiYdNIuZcH6GVsfG
            wfXFqO/ALdmhqm0nEbYvwTGnxPGNiMaLHAr8yhOP9JubLhYnLl3WVAs2AiflQ4erHw6BZ
            CIUm2kwi3q1Z/bd1aehqiU2mL+eaOSwugWYjpNtpLIRF+LS+brSeTf4L/gHK5axYbM+k9
            AAAAABJRU5ErkJggg==" alt="bard--v2">Generate with AI`;
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
            <strong>${index+1}. ${item.question}
            </strong>
              <p>${item.answer}</p>
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

