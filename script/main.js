const questionInput = document.querySelector('.js-question-input');
const answerInput = document.querySelector('.js-answers-input');
const questionButton = document.querySelector('.js-input-button');
const answerButton = document.querySelector('.js-input-button-answer');
const doneButton = document.querySelector('.js-done-button');
const resetButton = document.querySelector('.js-reset-button');
const dataContainer = document.querySelector('.js-data-container');
const expandButton = document.querySelector('.js-expand');

let Data = loadFromStorage();
export function loadFromStorage() {
  return JSON.parse(localStorage.getItem('data')) || [];
}

let question = '';
let answer = '';

if(questionButton){
questionButton.addEventListener('click', () => {
  const Getquestion = questionInput.value;
  if(Getquestion !== ''){
  document.querySelector('.question-container').classList.toggle('is-open');
  document.querySelector('.answers-container').classList.toggle('is-open');
  question = Getquestion;
  questionInput.value = '';
  }
  

})
}
if(answerButton){
answerButton.addEventListener('click', () => {
  const Getanswer = answerInput.value;
  answer = Getanswer;
  Data.push({
    question: question,
    answer: answer
  })
  saveTostorage();
  displayData();
  document.querySelector('.question-container').classList.toggle('is-open');
  document.querySelector('.answers-container').classList.toggle('is-open');
  answerInput.value ='';


})
}
if(doneButton){
doneButton.addEventListener('click', () => {
  if(Data && Data.length > 0){
  window.location.href = `testing.html`;
  }
})
}

if(resetButton){
  resetButton.addEventListener('click', () => {
    localStorage.removeItem('data');
    Data = [];
    displayData();
  })
}

function saveTostorage() {
  localStorage.setItem('data', JSON.stringify(Data));
}

function displayData() {
  let html= '';
  Data.forEach((item, index) => {
     html += `<div class="inbox-card">
                <strong>${index+1}. ${item.question}
                </strong>
                  <p>${item.answer}</p>
          </div>`;
    

  })
  if(dataContainer){
    dataContainer.innerHTML = html;
    expandButton.hidden = Data.length <= 1;
    if(expandButton.hidden){
      dataContainer.classList.remove('expanded');
      expandButton.textContent = 'Expand';
    }
  }
}

if(expandButton){
  expandButton.addEventListener('click', () => {
    dataContainer.classList.toggle('expanded');
    expandButton.textContent = dataContainer.classList.contains('expanded')
      ? 'Show less' : 'Expand';
  });
}

displayData();
