import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers  {
    constructor() {
        this.quiz = null;
        this.chosenAnswers = [];
        this.name= null;
        this.lastName= null;
        this.email= null;
        this.questionTitleElement= null;
        this.optionsElement= null;
        this.correctAnswers = [];


        this.routeParams = UrlManager.getQueryParams();
        UrlManager.checkUserData(this.routeParams);

        const answers =  this.routeParams.answers;
        this.chosenAnswers = answers ? answers.split(',').map(Number) : [];
        this.correctAnswers = this.getCorrectAnswers(this.routeParams.id);

        // this.init()
    }


        // async init(testId){
        //
        //     const userInfo = Auth.getUserInfo();
        //     if(!userInfo){
        //         location.href="#/";
        //     }
        //     const params = new URLSearchParams(window.location.search);
        //     const id = params.get('id');
        //         try {
        //             const result = await CustomHttp.request(config.host + '/tests/' + testId + '/result/details?userId=' + userInfo.userId, 'POST')
        //
        //             if (result) {
        //                 if (result.error) {
        //                     throw new Error(result.error)
        //                 }
        //                 this.startQuiz();
        //
        //             }
        //         } catch (error) {
        //             console.log(error);
        //         }
        //
        // }

        startQuiz(){
            document.getElementById('pre-title').innerText = this.quiz.name;
            this.questionTitleElement = document.getElementById('title')
            this.optionsElement = document.getElementById('options');
            const that = this;
            document.querySelector('.answer-user span').innerText =
                `${this.routeParams.name} ${this.routeParams.lastName}, ${this.routeParams.email}`;

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

        async getCorrectAnswers() {
            const userInfo = Auth.getUserInfo();
            if(!userInfo){
                location.href="#/";
            }
            try{
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + userInfo.userId, 'GET')

                if(result){
                    if(result.error){
                        throw new Error(result.error)
                    }
                    this.startQuiz();
                    return
                }
            } catch (error){
                console.log(error);
            }

        }
    }
