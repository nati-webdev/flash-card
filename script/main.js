const questionInput = document.querySelector('.js-question-input');
const answerInput = document.querySelector('.js-answers-input');
const questionButton = document.querySelector('.js-input-button');
const answerButton = document.querySelector('.js-input-button-answer')

const questions =[];
let question = '';
let answer = '';
questionButton.addEventListener('click', () => {
  const Getquestion = questionInput.value;

  document.querySelector('.question-container').classList.toggle('is-open');
  document.querySelector('.answers-container').classList.toggle('is-open');
  question = Getquestion;
})

answerButton.addEventListener('click', () => {
  const Getanswer = answerInput.value;
  answer = Getanswer;
  questions.push({
    question: question,
    answer: answer
  })
console.log(questions);

})
