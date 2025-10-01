import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers  {
    constructor() {
        this.quiz = null;
        this.chosenAnswers = [];
        this.correctAnswers = []
        this.questionTitleElement= null;
        this.optionsElement= null;

        this.userInfo = Auth.getUserInfo();



        this.init()



    }


        async init(){

            const hash = window.location.hash;
            const queryString = hash.split('?')[1];
            const params = new URLSearchParams(queryString);
            const testId = params.get('testId');

            const chosenAnswersParam = params.get('chosenAnswers');
            this.chosenAnswers = chosenAnswersParam
              ? chosenAnswersParam.split(',').map(Number)
              : [];

            console.log(this.chosenAnswers)



            if(!this.userInfo){
                location.href="#/";
            }


            console.log('userinfo',  this.userInfo);

            try {
                const result = await CustomHttp.request(
                  `${config.host}/tests/${testId}/result/details?userId=${ this.userInfo.userId}`,
                  'GET'
                );

                    if (result) {
                        if (result.error) {
                            throw new Error(result.error)
                        }
                        this.quiz = result.test;

                        if (this.quiz && this.quiz.questions) {
                            this.quiz.questions.forEach(question => {
                                question.answers.forEach(answer => {
                                    if (answer.correct) {
                                        this.correctAnswers.push(answer.id);
                                    }
                                });
                            });
                        }

                        this.startQuiz(result);

                    }
                } catch (error) {
                    console.log(error);
                }

        }

        startQuiz(result){
            document.getElementById('pre-title').innerText = result.test.name;
            this.questionTitleElement = document.getElementById('title')
            this.optionsElement = document.getElementById('options');
            const that = this;
            document.querySelector('.answer-user span').innerText =
                `${ this.userInfo.fullName}, ${ this.userInfo.email}`;

            this.showQuestion();

        }
        showQuestion() {
            const container = document.querySelector('.answers-container');
            container.innerHTML = '';

            this.quiz.questions.forEach((question, index) => {
                const questionBlock = document.createElement('div');
                questionBlock.className = 'question';

                const titleElement = document.createElement('div');
                titleElement.className = 'question-title';
                titleElement.innerHTML = `<span>Вопрос ${index + 1}:</span> ${question.question}`;
                questionBlock.appendChild(titleElement);

                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'question-options';

                const chosenAnswerId = this.chosenAnswers.find(id => {
                    return question.answers.some(answer => answer.id === id);
                });

                question.answers.forEach(answer => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'question-option';

                    const inputId = `answer-${question.id}-${answer.id}`;

                    const inputElement = document.createElement('input');
                    inputElement.type = 'radio';
                    inputElement.id = inputId;
                    inputElement.name = `question-${question.id}`;
                    inputElement.value = answer.id;


                    if (answer.id === chosenAnswerId) {
                        inputElement.checked = true;
                    }

                    const labelElement = document.createElement('label');
                    labelElement.setAttribute('for', inputId);
                    labelElement.innerText = answer.answer;

                    optionElement.appendChild(inputElement);
                    optionElement.appendChild(labelElement);

                    if (answer.id === chosenAnswerId) {
                        if (this.correctAnswers.includes(answer.id)) {
                            optionElement.classList.add('correct');
                        } else {
                            optionElement.classList.add('incorrect');
                        }
                    }

                    optionsContainer.appendChild(optionElement);
                });

                questionBlock.appendChild(optionsContainer);
                container.appendChild(questionBlock);
            });
        }
    }
