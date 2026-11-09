const questionInput = document.querySelector('.js-question-input');
const answerInput = document.querySelector('.js-answers-input');
const questionButton = document.querySelector('.js-input-button');
const answerButton = document.querySelector('.js-input-button-answer');
const aiButton = document.querySelector('.js-ai-button');
const doneButton = document.querySelector('.js-done-button');
const resetButton = document.querySelector('.js-reset-button');
const dataContainer = document.querySelector('.js-data-container');
const expandButton = document.querySelector('.js-expand');

let Data = loadFromStorage();
export function loadFromStorage() {
  return JSON.parse(localStorage.getItem('data')) || [{
    question: 'what is HTML',
    answer: 'HTML is a mark up language used to structure a web page'
  },{
    question: 'what is CSS',
    answer: 'CSS is a programming language used to style a  web page'
  },{
    question: 'what is JavaScript',
    answer: 'JavaScript is a programming language used to make a website interactive'
  },{
    question: 'what is C++',
    answer: 'C++ is a programming language used to program many sofrware'
  }];
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
    answerInput.value = '';
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
  questionInput.value ='';

});
}
if(aiButton){
  aiButton.addEventListener('click', async () => {
    const topic = question.trim();
    if(!topic) return;
    aiButton.textContent = 'Generating...';
    aiButton.disabled = true;
   
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
    Data = localStorage();
    displayData();
  })
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
           if(expandButton) expandButton.hidden = true;
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

if(expandButton){
  expandButton.addEventListener('click', () => {
    dataContainer.classList.toggle('expanded');
    expandButton.textContent = dataContainer.classList.contains('expanded')
      ? 'Show less' : 'Expand';
  });
}

displayData();
