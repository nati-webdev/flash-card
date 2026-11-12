import { loadFromStorage } from "./main.js";

let data = loadFromStorage();
console.log(data);
const skipButton = document.querySelector('.js-skip');
const revealButton = document.querySelector('.js-reveal');
const returnButton = document.querySelector('.js-return');
const flashCard = document.querySelector('.js-flash-card');
const flashCardAnswer = document.querySelector('.js-flash-card-answer');
const addQuestion = document.querySelector('.js-add');
const progressBar = document.querySelector('.progress-bar');

let currentQuestionIndex  = 0;
let progress = '';
let lastIndex = 0;
 
if(data && data.length > 0) {
flashCard.innerHTML = `${data[currentQuestionIndex].question}`;
  if(revealButton){
    revealButton.addEventListener('click', () => {
      flashCard.classList.add('is-open');
      flashCardAnswer.classList.add('is-open');
      flashCardAnswer.innerHTML = `${data[currentQuestionIndex]?.answer}`;
    })
  }
  if(skipButton){
    skipButton.addEventListener('click', () => {
      if(currentQuestionIndex >= data.length - 1){
        flashCard.innerHTML ='You reached the end. Add some topics to study';
        progressBar.style.width = '100%';
        return;
      }else if(currentQuestionIndex < data.length - 1){
        currentQuestionIndex ++;
        progress = `${(currentQuestionIndex / (data.length-1)) * 100}%`;
      }
      flashCardAnswer.classList.remove('is-open');
      flashCard.classList.remove('is-open');
      flashCard.innerHTML = `${data[currentQuestionIndex]?.question}`;
      progressBar.style.width = progress;
    });
  }
  if(returnButton) {
    returnButton.addEventListener('click', () => {
      if(currentQuestionIndex >0){
      currentQuestionIndex--;
      if(currentQuestionIndex === 0){
        progress = `2%`;
      }else{
        progress = `${(currentQuestionIndex / (data.length - 1)) * 100}%`;
      }
      }
        if(flashCardAnswer.classList.contains('is-open')){
          flashCardAnswer.classList.remove('is-open');
        }
        flashCard.classList.remove('is-open');
        flashCard.innerHTML = `${data[currentQuestionIndex]?.question}`;
        progressBar.style.width = progress;
    });
  }
  
}else{
  flashCard.innerHTML ='Add some topics to study';
}
if(addQuestion){
    addQuestion.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }